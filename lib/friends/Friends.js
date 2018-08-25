const { SteamFriends } = require('steam');
const { ChatEntryType } = require('../res/enums.json');

function playSound() {
    require('child_process').exec(`play ${__dirname}/../res/message.oga`, () => {});
}

class Friends {
	constructor(client, manager) {
		this.steamFriends = new SteamFriends(client);
		this.manager = manager;
        this.chatWindows = new Map();
		this.steamFriends.on('relationships', this.createOrUpdateFriends.bind(this));
		this.steamFriends.on('friendMsg', this.handleFriendMsg.bind(this));
		this.steamFriends.on('personaState', this.createOrUpdateFriends.bind(this));
		this.lastRecieved = Date.now();
        this.friends = {};
        this.manager.createFriendsWindow(this);
	}

	setOnline() {
		this.steamFriends.setPersonaState(1);
	}

	createOrUpdateFriends() {
        // prevent friend update spam
		setTimeout(() => {
			if (Date.now() - this.lastRecieved > 2e3) {
				// prevent update spam
				this.lastRecieved = Date.now();
				this.manager.sendDebug('recieved friends update');
			}
            let unknownFriends = [];
			for (const [friendId, relationship] of Object.entries(this.steamFriends.friends)) {
                // 3 means friend 5 means ignored
                if (relationship === 3) {
                    const info = this.steamFriends.personaStates[friendId];
                    if (info) {
                        this.friends[friendId] = {
                            name: info.player_name,
                            game_name: info.game_name || '',
                            status: info.persona_state || 0,
                            steam_id: friendId
                        }
                        this.manager.addWindow(this.friends[friendId]);
                    } else {
                        unknownFriends.push(friendId);
                    }
                }
            }
            this.steamFriends.requestFriendData(unknownFriends);
            this.manager.friendsWindow.content();
			this.manager.draw();
		}, 5000);
	}

	handleFriendMsg(id, msg, type) {
		if (ChatEntryType[type] === 'CHAT_MSG') {
			if (this.friends[id]) {
                playSound();
				let name = this.friends[id].name;
                this.manager.emit('message', id, {name, msg, type});
            }
		}
	}
}

module.exports = Friends;
