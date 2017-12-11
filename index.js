const Account = require('./Account');
const { username, password, auth } = require('./auth.json');

const acc = new Account(username, password,
	{autoreconnect: false, sentryFileDir: './', auth});

function handleInput(input) {
	let [command, ...args] = input.split(' ');
	command = command.toLowerCase();
	if (command === 'status') {
		console.log("Most recently talked to: " + this.friends.mostRecent);	
	} else if (command === 'r') {
		this.friends.get(this.friends.mostRecent).send(args.join(' '));
	}
}
acc.setHandler(handleInput);
/*
rl.on('line', (input) => {
	try {
		let out = eval(input);
		if (typeof out !== 'string')
			console.log(`[OUT] ${require('util').inspect(out)}`);
		else
			console.log(`[OUT] ${out}`);
	} catch(err) {
		console.error(`[OUT] ${err}`);
	}
});
*/
