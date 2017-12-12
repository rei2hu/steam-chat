const ChatWindow = require('./ChatWindow');

class DebugWindow extends ChatWindow {
	constructor(manager, index) {
		super(manager, index);
		this.id = 'DEBUG';
		this.name = 'DEBUG';
	}

	isOnline() {
		return true;
	}

	getFullName() {
		return 'Debug Window';
	}
}

module.exports = DebugWindow;
