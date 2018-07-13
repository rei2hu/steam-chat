class Window {
    constructor(manager, id) {
        this.manager = manager;
        this.id = id;
        this.unreadMessages = 0;
        this.messages = [];
    }

    addMessage(line) {
        let time = '[' + new Date().toISOString().match(/T(.*?)\./)[1] + ']';
        // 1 for the leftmost bar, 10 for the time
        let prefixLength = 11;
        let maxLineLength = process.stdout.columns - 2 - prefixLength;
        // split the line into every so many characters
        let lines = line.match(new RegExp('.{1,' + maxLineLength + '}', 'g'));
        this.messages.push(time + ' ' + lines[0]);
        for (let  i = 1; i < lines.length; i++) {
            this.messages.push(' '.repeat(prefixLength) + lines[i]);
        }
        if (this.manager.active !== this.id) {
            this.unreadMessages++;
        }
    }

    readMessages() {
        this.unreadMessages = 0;
    }

    content() {
        return this.messages;
    }

}

module.exports = Window;
