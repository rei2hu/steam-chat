class ChatWindow {
	constructor(manager, index) {
		this.manager = manager;
		this.unreadMessages = 0;
		this.lines = [];
		this.index = index;
	}
	
	setInfo(info) {
		this.friend = info;
		this.name = info.name;
		this.id = info.id;
	}

	addLine(line) {
		let time = '[' + new Date().toISOString().match(/T(.*?)\./)[1] + ']';
		this.lines.push(time + ' ' + line);
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
