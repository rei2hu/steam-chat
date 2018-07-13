const Window = require('./Window');

class ChatWindow extends Window {
    constructor(manager, info) {
        super(manager, info.steam_id);
        this.name = info.name;
        this.game_name = info.game_name;
        this.id = info.steam_id;
    }

    addMessage(line, self) {
        if (self) {
            super.addMessage(line);
        } else {
            super.addMessage(this.name + ': ' + line);
        }
    }

    content() {
        return ['   Chatting with ' + this.name + (this.game_name ? ' playing ' + this.game_name : '')]
            .concat(super.content());
    }
}

module.exports = ChatWindow;
