const Account = require('./account/Account');
const { username, password, auth } = require('./auth.json');

// hopefully this weird ass indentation
// doesn't trigger anyone
const acc = new Account(username, password, 
	{
	// account options
		// reconnect on disconnects?
		autoreconnect: true,
		// your sentry file's directory
		sentryFileDir: './',
		// the auth code sent to your email
		auth: auth,
		// the auth code sent to your phone
		twofa: undefined,

	// chat window manager options
		// the prompt
		promptString: 'xD text here!: ',
		// the help message, for now use default because it corresponds with default handler
		helpString: 'muh useless help message',
		// directory to store chat logs
		logDir: './chatlogs'

	// planned things
		// currStringFormat: a way to format the currently chatting with prompt
		// customHandler: a function you define to handle your input
	});
