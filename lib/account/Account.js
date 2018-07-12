const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const ChatWindowManager = require('../windows/ChatWindowManager');
const Friends = require('../friends/Friends');
const enums = require('../res/enums.json');

const { SteamClient, SteamUser } = require('steam');

class Account {
	constructor(username, password, options = {
		autoreconnect: false,
		sentryFileDir: './',
		auth: undefined,
		twofa: undefined,
		promptString: '> ',
		helpString: 'm [msg] - send msg | >, < - change tabs | r - redraw | ctrl + c - quit',
		logDir: './chatlogs'
	}) {
		this.client = new SteamClient();
		this.steamUser = new SteamUser(this.client);
		this.chatWindowManager = new ChatWindowManager(options.promptString, options.helpString, options.logDir);
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
        this.client.on('debug', this.printToDebug.bind(this));
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
		this.printToDebug('Attempting to log on');
	}

	checkResponse(res) {
		if (res.eresult == '1') {
			this.printToDebug('Logged on ok');
			this.friends.setOnline();
		} else {
			this.printToDebug('Error logging on:');
			this.printToDebug('  ' + (enums.LoginState[res.eresult] || `Unknown error (${res.eresult})`));
			this.attemptReconnect();
		}
	}

	attemptReconnect() {
		if (this.autoreconnect) {
			this.printToDebug('Reconnecting in 5 seconds.');
			setTimeout(() => this.client.connect(), 5000);
		} else {
			this.printToDebug('Autoreconnect not set, not reconnecting.');
			this.printToDebug('Closing program, cleaning up things.');
			this.resourceCleanup();
		}
	}

	resourceCleanup() {
		this.printToDebug('Cleaning up client');
		if (this.client.connected) {
			this.client.disconnect();
		}
		this.client.removeAllListeners();
		this.steamUser.removeAllListeners();
		this.friends.resourceCleanup();
		this.chatWindowManager.resourceCleanup();
	}

	errorHandle(err) {
		this.printToDebug('Recieved error, logged off.');
		this.attemptReconnect();
	}
	
	logoffHandle() {
		this.printToDebug('Logged off.');
		this.attemptReconnect();
	}

	sentryHandle(auth, callback) {
		this.printToDebug('Recieved sentry file ' + auth.filename);
		fs.writeFileSync(this.sentryFile, auth.bytes);
		callback({
			sha_file: crypto.createHash('sha1').update(auth.bytes).digest()
		});
	}

	printToDebug(text, type = 0) {
		this.chatWindowManager.sendDebug(text, type);
	}
}

module.exports = Account;
