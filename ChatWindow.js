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

	sendText(text) {
		this.appendText(text, true);
		if (this.friend) {
			this.friend.send(text);
		}
	}

	appendText(text, me) {
		let date = new Date();
		let time = `[${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}]`;
		if (!me) {
			this.lines.push(time + text);
		} else {
			this.lines.push(time + '[ME]: ' + text);
		}
		if (this.lines.length > process.stdout.rows - 12) {
			this.lines.shift();
		}
		if (this.manager.active !== this.index) {
			this.unreadMessages++;
		}
		this.manager.redraw();
	}

	draw() {
		let str = [];
		for (let i = 0; i < process.stdout.rows - 12; i++) {
			str.push(this.lines[i] || '');
		}
		return str;
	}

	readMessages() {
		this.unreadMessages = 0;
	}
}

module.exports = ChatWindow;
