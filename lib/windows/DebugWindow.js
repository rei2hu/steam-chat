const ChatWindow = require('./ChatWindow');
const FileWriterQueue = require('./FileWriterQueue');

class DebugWindow extends ChatWindow {
	constructor(manager, index, dir) {
		super(manager, index);
		this.id = 'DEBUG';
		this.name = 'DEBUG';
		this.fwq = new FileWriterQueue(dir, this.id, this);
	}

	isOnline() {
		return true;
	}

	getFullName() {
		return 'Debug Window';
	}
}

module.exports = DebugWindow;
