class InputHandler {
	constructor(manager) {
		this.manager = manager;
		process.stdin.setRawMode(true);
		process.stdin.on('data', this.handleKeyPress.bind(this));
		this.resetBuffer();
	}

	// not a fan of this indentation style but it makes
	// the comments decent
	handleKeyPress(key) {
		let charCode = key.toString().charCodeAt(0);
		// ctrl c
		if (key == '\u0003') {
			process.exit();
		}
		// right arrow key
		else if (key == '\u001b[C') {
			process.stdout.write('\u001b[1C');
			this.cursorPos = Math.min(this.cursorPos + 1, this.trueLength);
		}
		// left arrow key
		else if (key == '\u001b[D') {
			process.stdout.write('\u001b[1D');
			this.cursorPos = Math.max(this.cursorPos - 1, 0);
		}
		// between (space) and ~ see man ascii
		else if (charCode >= 32 && charCode <= 126) {
			this.buffer.splice(this.cursorPos++, 0, key.toString());
			this.trueLength++;
			this.buffer.pop();
		}
		// backspace
		else if (charCode === 127) {
			if (this.cursorPos === 0) {
				return;
			}
			this.buffer.splice(this.cursorPos - 1, 1);
			this.buffer.push(' ');
			this.cursorPos--;
			this.trueLength--;
		}
		// enter
		else if (charCode === 13) {
			this.defaultHandler();
		}
		process.stdout.cursorTo(this.promptLength());
		process.stdout.write(this.bufferString());
	}

	promptLength() {
		return this.manager.prompt.length + 3;
	}

	resetBuffer() {
		this.buffer = new Array(process.stdout.columns - this.manager.prompt.length - 4).fill(' ');
		this.cursorPos = 0;
		this.trueLength = 0;
	}

	bufferString() {
		let tempBuffer = this.buffer.slice();
		tempBuffer[this.cursorPos] = '…';
		return tempBuffer.join('');
	}

	defaultHandler() {
		const text = this.bufferString().slice(0, this.trueLength);
		this.resetBuffer();
		if (!this.manager.ready) {
			this.manager.sendDebug('Not ready yet, please wait a little!');
			return;
		}
		const [command, ...args] = text.split(' ');
		if (command === 'm') {
			this.manager.sendText(args.join(' '));
		} else if (command === '>') {
			this.manager.switchTab(this.manager.active + 1);
		} else if (command === '<') {
			this.manager.switchTab(this.manager.active - 1);
		} else if (command === 'r') {
			this.manager.draw();
		} else {
			this.defaultErrorResponse();
		}
	}

	defaultErrorResponse(message) {
		this.manager.sendDebug('Unknown Command!');
	}

	
}

module.exports = InputHandler;
