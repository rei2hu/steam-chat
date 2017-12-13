const path = require('path');
const fs = require('fs');

const ChatWindow = require('./ChatWindow');
const DebugWindow = require('./DebugWindow');
const InputHandler = require('./InputHandler');
const formatAndPrint = require('./OutputFormatter');

class ChatWindowManager {
	constructor(promptString, helpString, logDir) {
		this.active = 0;
		this.ready = false;
		this.title = 'steam-chat for shell';
		this.prompt = promptString;
		this.helpString = helpString;
		this.logDir = logDir;
		this.debugWindow = new DebugWindow(this, 0, this.logDir)
		this.windows = [this.debugWindow];
		this.input = new InputHandler(this);
		this.checkDirectory(path.join(this.logDir, 'x'));
		this.draw();
	}

	checkDirectory(d) {
		const dir = path.dirname(d);
		if (!fs.existsSync(dir)) {
			this.checkDirectory(dir);
			this.sendDebug('Creating ' + dir + ' directory.');
			fs.mkdirSync(dir);
		}
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
		this.debugWindow.addLine(text);
	}

	createWindow() {
		const win = new ChatWindow(this, this.windows.length, this.logDir);
		this.windows.push(win);
		return win;
	}

	draw() {
		this.ready = false;
		formatAndPrint(this.title, this.tabs(), this.currentText(), this.innerText(), this.helpString, this.promptAndBuffer());
		this.ready = true;
	}

	tabs() {
		let tabs = [];
		for (let i = 0; i < this.windows.length; i++) {
			const win = this.windows[i];
			if (win.isOnline()) {
				if (win.index === this.active) {
					tabs.push(win.name);
				} else {
					tabs.push(win.name.slice(0, 3) + (win.unreadMessages > 0 ? '*' : ''));
				}
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

	promptAndBuffer() {
		return this.prompt  + this.input.bufferString();
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

