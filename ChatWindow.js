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
		this.manager.redraw();
	}

	appendText(text, me) {
		let time = '[time here] ';
		if (!me) {
			this.lines.push(time + text);
		} else {
			this.friend.send(text);
			this.lines.push(time + '[ME]: ' + text);
		}
		if (this.manager.active !== this.index) {
			this.unreadMessages++;
		}
		this.manager.redraw();
	}

	draw() {
		let linesToPrint = this.lines.length - process.stdout.rows + 2;
		linesToPrint = Math.max(linesToPrint, 0);
		for (let i = linesToPrint; i < this.lines.length; i++) {
			console.log(this.lines[i]);
		}
	}

	readMessages() {
		this.unreadMessages = 0;
	}
}

module.exports = ChatWindow;
