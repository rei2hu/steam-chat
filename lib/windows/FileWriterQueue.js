const fs = require('fs');
const path = require('path');

class FileWriterQueue {
	constructor(dir, id, chatWindow) {
		this.contents = [];
		this.id = id;
		this.dir = dir;
		this.chatWindow = chatWindow;
		this.path = path.join(dir, id + '_logs.txt');
		this.queueCheck = setInterval(this.check.bind(this), 1000);
		// we'll have one FWQ per steam id
		// so each log file is only accessed by at most
		// one FWQ. FWQ is FileWriterQueue btw.
	}

	addJob(text) {
		this.contents.push(text + '\r\n');
	}

	check() {
		if (this.contents.length > 0) {
			this.doJob();
			return true;
		} else {
			return false;
		}
	}

	doJob() {
		if (this.lock) {
			return;
		}
		this.lock = true;
		// callback hell here i come
		fs.stat(this.path, (err, res) => {
			if (err) {
				fs.writeFile(this.path, this.contents.shift(), () => {
					this.lock = false;
				});
			} else {
				fs.appendFile(this.path, this.contents.shift(), () => {
					this.lock = false;
				});
			}
		});
	}

	cleanup() {
		/*
		while (this.check()) {
			// busy wait :thinking:
		}
		*/
		clearInterval(this.queueCheck);
	}
}

module.exports = FileWriterQueue;
