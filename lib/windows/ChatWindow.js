const FileWriterQueue = require('./FileWriterQueue');

class ChatWindow {
	constructor(manager, index, dir) {
		this.manager = manager;
		this.unreadMessages = 0;
		this.lines = [];
		this.index = index;
		this.dir = dir;
	}
	
	setInfo(info) {
		this.friend = info;
		this.name = info.name;
		this.id = info.id;
		this.fwq = new FileWriterQueue(this.dir, this.id, this);
	}

	addLine(line) {
		let time = '[' + new Date().toISOString().match(/T(.*?)\./)[1] + ']';
		this.fwq.addJob(time + ' ' + line);
		let prefix = 11;
		let length = process.stdout.columns - 2 - prefix;
		let regexp = new RegExp('.{1,' + length + '}', 'g');
		let lines = line.match(regexp);
		this.lines.push(time + ' ' + lines[0]);
		for (let i = 1; i < lines.length; i++) {
			this.lines.push(' '.repeat(prefix) + lines[i]);
		}
		if (this.manager.active !== this.index) {
			this.unreadMessages++;
		}
		this.manager.draw();
	}

	isOnline() {
		return this.friend.state !== 'OFFLINE';
	}

	getFullName() {
		return 'Chatting with ' + this.friend.displayName();
	}

	getInnerText() {
		let windowHeight = process.stdout.rows - 9; // 9 for the tabs/current/prompt heighs/title
		return this.lines.concat(new Array(Math.max(windowHeight - this.lines.length, 0)).fill('')).slice(-windowHeight);
	}

	readMessages() {
		this.unreadMessages = 0;
	}
}

module.exports = ChatWindow;
