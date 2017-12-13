const SteamChat = require('./lib/index');
const { username, password, auth } = require('./auth.json');

// hopefully this weird ass indentation
// doesn't trigger anyone
const sc = new SteamChat(username, password,
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
		promptString: '> ',
		// the help message, for now use default because it corresponds with default handler
		helpString: 'm [msg] - send msg | >, < - change tabs | r - redraw | ctrl + c - quit',
		// directory to store chat logs
		logDir: './chatlogs'

	// planned things
		// currStringFormat: a way to format the currently chatting with prompt
		// customHandler: a function you define to handle your input
	});
