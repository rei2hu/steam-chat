const ChatWindow = require('./ChatWindow');
const readline = require('readline');

class ChatWindowManager {
	constructor() {
		this.windows = [];
		this.active = 0;
		this.reader = readline.createInterface({
			input: process.stdin
		});
		this.reader.on('line', this.defaultHandler.bind(this));
		this.ready = false;
	}

	indent(text, spaces) {
		return text.split('\n').map(e => " ".repeat(spaces) + e).join('\n');
	}

	defaultHandler(line) {
		if (!this.ready) {
			console.log('Not ready yet, please wait a little')
			return;
		}
		const [command, ...args] = line.split(' ');
		if (command === 'm') {
			this.sendText(args.join(' '), true);
		} else if (command === '>') {
			this.switchTab(this.active + 1);
		} else if (command === '<') {
			this.switchTab(this.active - 1);
		} else if (command === 'r') {
			this.redraw();
		} else {
			this.defaultErrorResponse();
		}
	}

	defaultErrorResponse() {
		console.log('  < Unknown command!');
		process.stdout.write('  > ');
	}

	sendText(text, me = false) {
		this.windows[this.active].sendText(text);
	}

	createWindow() {
		const win = new ChatWindow(this, this.windows.length);
		this.windows.push(win);
		return win;
	}

	drawTabs() {
		let str = '║ ';
		for (let i = 0; i < this.windows.length; i++) {
			const win = this.windows[i];
			if (win.friend.state === 'OFFLINE') {
				continue;
			}
			if (i === this.active) {
				str += (win.name + " ".repeat(5)).slice(0, 5);
			} else {
				str += (win.name + " ").slice(0, 1);
			}
			str += ` (${win.unreadMessages}) ║ `;
		}
		let current = 'Currently chatting with ';
		current += this.windows[this.active].friend.displayName();
		return {tabs: str, current};
	}

	drawActiveWindow() {
		const win = this.windows[this.active];
		return win.draw();
	}

	redraw() {
		this.ready = false;
		console.log('\u001b[2J\u001b[0;0H  steam-chat for shell');
		const {tabs, current} = this.drawTabs();
		const messages = this.drawActiveWindow();
		const promp = '>';
		this.drawUI(tabs, current, messages, promp);
		this.ready = true;
	}

	drawUI(tabs, current, messages, promp) {
		let barIndexes = [];
		for (let i = 1; i < tabs.length; i++) {
			if (tabs[i] === '║') {
				barIndexes.push(i);
			}
		}
		let currIdx = current.length + 2;
		const dr = '╔';
		const dl = '╗';
		const dlr = '╦';
		const lr = '═';
		const udr = '╠';
		const ulr = '╩';
		const ul = '╝';
		const udl = '╣';
		const ud = '║';
		const ur = '╚';
		const udlr = '╬';
		let tiptop = dr;
		let bottombop = udr;
		let bottombot = udr;
		for (let i = 1; i < tabs.length - 2; i++) {
			if (i === barIndexes[0]) {
				barIndexes.shift();
				if (i === currIdx + 1) {
					bottombop += udlr;
					bottombot += ul;
				} else {
					bottombop += ulr;
					if (i < currIdx) {
						bottombot += lr;
					}
				}
				tiptop += dlr;
			} else {
				if (i <= currIdx) {
					bottombot += lr;
					bottombop += lr;
				} else if (i === currIdx + 1) {
					bottombot += ul;
					bottombop += dlr;
				} else {
					bottombop += lr;
				}
				tiptop += lr;
			}
		}
		tiptop += dl;
		if (tabs.length - 2 === currIdx + 1) {
			bottombop += udl;
			bottombot += ul;
		} else if (currIdx > tabs.length - 2) {
			bottombop += ulr;
			bottombot += lr;
			for (let i = tabs.length - 2; i < currIdx; i++) {
				bottombop += lr;
				bottombot += lr;
			}
			bottombop += dl;
			bottombot += ul;
		} else {
			bottombop += ul;
		}
		
		const helpmsg = ud + ' m [msg] - to send message | >, < - to change tabs | r - redraw | ctrl+c - to quit';
		messages = messages.map(e => e !== '' ? udr + ' ' + e : ud);
		console.log(tiptop);
		console.log(tabs);
		console.log(bottombop);
		console.log(ud + ' ' + current + ' ' + ud);
		console.log(bottombot);
		console.log(messages.join('\n'));
		console.log(udr + lr.repeat(helpmsg.length) + dl);
		console.log(helpmsg);
		process.stdout.write(ur + ' > ');
	}

	switchTab(index) {
		let mod = 1;
		if (index < this.active) {
			mod = -1;
		}
		for (let i = 0; i < this.windows.length && i > -this.windows.length; i += mod) {
			this.active = (this.windows.length + index  + i) % this.windows.length;
			if (this.windows[this.active].friend.state !== 'OFFLINE') {
				break;
			}
		}
		this.windows[this.active].readMessages();
		this.redraw();
	}
}

module.exports = ChatWindowManager;

