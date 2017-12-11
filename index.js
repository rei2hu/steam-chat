const Account = require('./Account');
const { username, password, auth } = require('./auth.json');

const acc = new Account(username, password,
	{autoreconnect: false, sentryFileDir: './', auth});
