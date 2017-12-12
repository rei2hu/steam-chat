const readline = require('readline');

const ChatWindow = require('./ChatWindow');
const DebugWindow = require('./DebugWindow');
const formatAndPrint = require('./OutputFormatter');

class ChatWindowManager {
	constructor() {
		this.title = 'steam-chat for shell';
		this.prompt = '>';
		this.helpString = 'm [msg] - send msg | >, < - change tabs | r - redraw | ctrl+c - quit';
		this.debugWindow = new DebugWindow(this, 0)
		this.windows = [this.debugWindow];
		this.active = 0;
		this.reader = readline.createInterface({
			input: process.stdin
		});
		this.reader.on('line', this.defaultHandler.bind(this));
		this.ready = false;
		this.draw();
	}

	defaultHandler(line) {
		if (!this.ready) {
			console.log('Not ready yet, please wait a little')
			return;
		}
		const [command, ...args] = line.split(' ');
		if (command === 'm') {
			this.sendText(args.join(' '));
		} else if (command === '>') {
			this.switchTab(this.active + 1);
		} else if (command === '<') {
			this.switchTab(this.active - 1);
		} else if (command === 'r') {
			this.draw();
		} else {
			this.defaultErrorResponse();
		}
	}

	defaultErrorResponse() {
		console.log('  < Unknown command!');
		process.stdout.write('  > ');
	}

	sendText(text) {
		let activeWindow = this.windows[this.active];
		activeWindow.addLine(text);
		if (activeWindow.friend) {
			activeWindow.friend.send(text);
		}
	}

	sendDebug(text, type = 0) {
		// type will be the warning level
		// 0 - info
		// 1 - warning
		// 2 - error
		// 3 - rekt
		this.windows[0].addLine(text);
	}

	createWindow() {
		const win = new ChatWindow(this, this.windows.length);
		this.windows.push(win);
		return win;
	}

	draw() {
		this.ready = false;
		formatAndPrint(this.title, this.tabs(), this.currentText(), this.innerText(), this.helpString, this.prompt);
		this.ready = true;
	}

	tabs() {
		let tabs = [];
		for (let i = 0; i < this.windows.length; i++) {
			const win = this.windows[i];
			if (win.isOnline()) {
				tabs.push(win.name.slice(0, 3) + ` (${win.unreadMessages})`);
			}
		}
		return tabs;
	}

	innerText() {
		return this.windows[this.active].getInnerText();
	}

	currentText() {
		return this.windows[this.active].getFullName();
	}

	switchTab(index) {
		let mod = 1;
		if (index < this.active) {
			mod = -1;
		}
		for (let i = 0; i < this.windows.length && i > -this.windows.length; i += mod) {
			this.active = (this.windows.length + index  + i) % this.windows.length;
			if (this.windows[this.active].isOnline()) {
				break;
			}
		}
		this.windows[this.active].readMessages();
		this.draw();
	}
}

module.exports = ChatWindowManager;

