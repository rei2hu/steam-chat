const EventEmitter= require('events');

const DebugWindow = require('./DebugWindow');
const FriendsWindow = require('./FriendsWindow');
const ChatWindow = require('./ChatWindow');

const InputHandler = require('./InputHandler');

const drawContent = require('./draw');

class WindowManager extends EventEmitter {
	constructor() {
        super();
        process.stdout.write(' '.repeat(process.stdout.columns).repeat(process.stdout.rows - 2));
		this.friendsShowing = false;
        this.active = '0';
        this.inputHandler = new InputHandler(this);
        this.windows = new Map();
        this.createDebugWindow();
        this.on('message', this.handleMessage.bind(this));
	}

    createDebugWindow() {
		this.debugWindow = new DebugWindow(this, '0');
        this.windows.set('0', this.debugWindow);
    }

    createFriendsWindow(friends) {
        this.friendsWindow = new FriendsWindow(friends.friends, this);
        this.friends = friends;
        this.ready = true;
        this.draw();
    }

    addWindow(info) {
        if (this.windows.has(info.steam_id)) return;
        this.windows.set(info.steam_id, new ChatWindow(this, info));
    }

    setActive(active) {
        const ac = this.friendsWindow.indexFriend.get(active);
        if (ac) {
            this.active = ac;
            this.draw();
            this.sendDebug('set window to ', + active, ac)
        } else {
            this.sendDebug('could not activate that window', active);
        }
    }

    toggleFriends() {
        this.friendsShowing = !this.friendsShowing;
        this.draw();
    }

    async draw(clearterm) {
        if (this.ready) {
            this.ready = false;
            await drawContent(this.windows.get(this.active).content(),
                this.friendsWindow, this.friendsShowing, clearterm);
            this.ready = true;
        }
	}

    handleMessage(id, info) {
        // a debug message
        if (id === 0) {
            this.sendDebug(info.msg);
        } else {
            this.windows.get(id).addMessage(info.msg);
        }
        this.draw();
    }

    sendDebug(...text) {
		this.debugWindow.addMessage(text + '');
        this.draw();
	}

    send(message) {
        if (this.active !== '0') {
            this.friends.steamFriends.sendMessage(this.active, message);
        }
        this.windows.get(this.active).addMessage(message, true);
        this.draw();
    }
}

module.exports = WindowManager;
