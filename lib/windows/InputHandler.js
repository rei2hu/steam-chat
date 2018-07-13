const tput = require('./tput');

class InputHandler {
	constructor(manager) {
		this.manager = manager;
		process.stdin.setRawMode(true);
		process.stdin.on('data', this.handleKeyPress.bind(this));
		this.resetBuffer();
	}

	// not a fan of this indentation style but it makes
	// the comments decent
	async handleKeyPress(key) {
		let charCode = key.toString().charCodeAt(0);
		// ctrl c
		if (key == '\u0003') {
			process.exit();
		}
		// right arrow key
		else if (key == '\u001b[C') {
            if (this.cursorPos < this.trueLength) {
                process.stdout.write(await tput('cuf1'));
                this.cursorPos++;
            }
		}
		// left arrow key
		else if (key == '\u001b[D') {
            if (this.cursorPos > 0) {
                process.stdout.write(await tput('cub1'));
                this.cursorPos--;
            }
		}
		// between (space) and ~ see man ascii
		else if (charCode >= 32 && charCode <= 126) {
			this.buffer.splice(this.cursorPos, 0, key.toString());
			this.buffer.pop();
            this.cursorPos++;
			this.trueLength++;
            process.stdout.write(await tput('cuf1'));
            this.printBuffer();
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
            process.stdout.write(await tput('cub1'));
            this.printBuffer();
		}
		// enter
		else if (charCode === 13) {
			this.defaultHandler();
		}
	}

    async printBuffer() {
        this.manager.ready = false;
        process.stdout.write(await tput('sc'));
        process.stdout.cursorTo(2);
        process.stdout.write(this.bufferString());
        process.stdout.write(await tput('rc'));
        this.manager.ready = true;
    }

	resetBuffer() {
		this.buffer = new Array(process.stdout.columns - 2).fill(' ');
		this.cursorPos = 0;
		this.trueLength = 0;
        process.stdout.cursorTo(2);
        this.printBuffer();
	}

	bufferString() {
		let tempBuffer = this.buffer.slice();
		return tempBuffer.join('');
	}

	defaultHandler() {
		const text = this.buffer.join('').slice(0, this.trueLength);
		if (!this.manager.ready) {
			this.manager.sendDebug('not ready yet, please wait a little!');
			return;
		}
		const [command, ...args] = text.split(' ');
		if (command === 'f') {
            if (args[0]) {
                this.manager.setActive(args[0]);
            } else {
                this.manager.toggleFriends();
            }
        } else if (command === 'm') {
            this.manager.send(args.join(' '));
        } else if (command === 'r') {
            this.manager.draw(true);
        } else {
			this.defaultErrorResponse(text);
		}
		this.resetBuffer();
	}

	defaultErrorResponse(message) {
		this.manager.sendDebug('unknown command - ' + message);
	}
}

module.exports = InputHandler;
