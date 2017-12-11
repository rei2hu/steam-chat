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
	}

	defaultHandler(line) {
		if (line === '>') {
			this.switchTab(this.active + 1);
		} else if (line === '<') {
			this.switchTab(this.active - 1);
		} else {
			this.appendText(line, true);
		}
	}

	appendText(text, me = false) {
		this.windows[this.active].appendText(text, me);
	}

	createWindow() {
		const win = new ChatWindow(this, this.windows.length);
		this.windows.push(win);
		return win;
	}

	drawTabs() {
		let str = '| ';
		for (let i = 0; i < this.windows.length; i++) {
			const win = this.windows[i];
			if (win.friend.state === 'OFFLINE') {
				continue;
			}
			if (i === this.active) {
				str += win.name.toUpperCase();
			} else {
				str += win.name;
			}
			str += ` (${win.unreadMessages}) | `;
		}
		console.log(str);
	}

	drawActiveWindow() {
		const win = this.windows[this.active];	
		win.draw();
	}

	redraw() {
		console.log('\u001b[2J\u001b[0;0H');
		this.drawTabs();
		this.drawActiveWindow();
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

