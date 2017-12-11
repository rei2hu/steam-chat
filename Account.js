const { SteamClient, SteamUser } = require('steam');
const Friends = require('./Friends');
const ChatWindowManager = require('./ChatWindowManager');

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const enums = require('./res/enums.json');

class Account {
	constructor(username, password, options = {autoreconnect: false, sentryFileDir: './'}) {
		this.client = new SteamClient();
		this.steamUser = new SteamUser(this.client);
		this.chatWindowManager = new ChatWindowManager();
		this.friends = new Friends(this.client, this.chatWindowManager);
		this.account_name = username;
		this.password = password;
		this.autoreconnect = options.autoreconnect;
		this.sentryFile = path.join(options.sentryFileDir, 'login.sentry');
		this.twofa = options.twofa;
		this.auth = options.auth;
		this.client.on('connected', this.login.bind(this));
		this.client.on('logOnResponse', this.checkResponse.bind(this));
		this.client.on('loggedOff', this.logoffHandle.bind(this));
		this.client.on('error', this.errorHandle.bind(this));
		this.steamUser.on('updateMachineAuth', this.sentryHandle.bind(this));
		this.client.connect();
	}

	login() {
		let sha1 = '';
		if (fs.existsSync(this.sentryFile)) {
			sha1 = crypto.createHash('sha1').update(fs.readFileSync(this.sentryFile)).digest();
		}
		this.steamUser.logOn({
			account_name: this.account_name,
			password: this.password,
			auth_code: this.auth,
			two_factor_code: this.twofa,
			sha_sentryfile: sha1,
		});
	}

	checkResponse(res) {
		if (res.eresult == '1') {
			console.log('Logged on ok');
			this.friends.setOnline();
		} else {
			console.error('Error logging on:');
			console.error('  ' + (enums.LoginState[res.eresult] || `Unknown error (${res.eresult})`));
			this.reconnect();
		}
	}

	reconnect() {
		if (this.autoreconnect) {
			console.log('Reconnecting in 5 seconds');
			setTimeout(() => this.client.connect(), 5000);
		}
	}

	logoffHandle() {
		console.log('Logged off gracefully.');
	}

	errorHandle(err) {
		console.error('Logged off with error.');
		this.reconnect();
	}

	sentryHandle(auth, callback) {
		console.log('Recieved sentry file ' + auth.filename);
		fs.writeFileSync(this.sentryFile, auth.bytes);
		callback({
			sha_file: crypto.createHash('sha1').update(auth.bytes).digest()
		});
	}
}

module.exports = Account;






