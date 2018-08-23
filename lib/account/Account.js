const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const WindowManager = require('../windows/WindowManager');
const Friends = require('../friends/Friends');
const enums = require('../res/enums.json');

const { SteamClient, SteamUser } = require('steam');

// get steam servers
const servers = new Promise((resolve) => {
    require('https').get('https://api.steampowered.com/ISteamDirectory/GetCMList/v1/?format=json&cellid=0', (res) => {
        let b = '';
        res.on('data', (c) => b += c);
        res.on('end', () => resolve(b));
    });
});

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
        servers.then((jsonString) => {
            // override thie given server list with updated one
            try {
                jsonString = JSON.parse(jsonString);
            } catch(e) {
                jsonString = require('../res/bServers.json');
            }
            require('steam').servers = jsonString.response.serverlist.map((e) => {
                const [host, port] = e.split(":");
                return {host, port};
            });
            this.client = new SteamClient();
            this.steamUser = new SteamUser(this.client);
            this.windowManager = new WindowManager();
            this.steamFriends = new Friends(this.client, this.windowManager);

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
        });
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
		this.printToDebug('attempting to log on');
	}

	checkResponse(res) {
		if (res.eresult == '1') {
			this.printToDebug('logged on ok');
            this.steamFriends.setOnline();
		} else {
			this.printToDebug('error logging on:');
			this.printToDebug('  ' + (enums.LoginState[res.eresult] || `Unknown error (${res.eresult})`));
			this.attemptReconnect();
		}
	}

	attemptReconnect() {
		if (this.autoreconnect) {
			this.printToDebug('reconnecting in 5 seconds.');
			setTimeout(() => this.client.connect(), 5000);
		} else {
			this.printToDebug('autoreconnect not set, not reconnecting.');
			this.printToDebug('closing program');
		}
	}

	errorHandle(err) {
		this.printToDebug(err);
	}
	
	logoffHandle() {
		this.printToDebug('logged off.');
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
		this.windowManager.sendDebug(text, type);
	}
}

module.exports = Account;
