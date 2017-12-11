const Friend = require('./Friend');
const { SteamFriends } = require('steam');
const { ChatEntryType } = require('./res/enums.json');

class Friends {
	constructor(client) {
		this.steamFriends = new SteamFriends(client);
		this.friends = new Map();
		this.mostRecent;
		this.steamFriends.on('relationships', this.createFriends.bind(this));
		this.steamFriends.on('friendMsg', this.handleFriendMsg.bind(this));
		this.steamFriends.on('personaState', this.createFriends.bind(this));
	}

	setOnline() {
		this.steamFriends.setPersonaState(1);
	}

	createFriends() {
		// sht workaround hopefully
		setTimeout(() => {
			for (const friendId in this.steamFriends.friends) {
				this.createFriend(friendId);
			}
		}, 5000);
	}

	handleFriendMsg(id, msg, type) {
		console.log('recieved message ' + type)
		this.mostRecent = id;
		if (ChatEntryType[type] === 'CHAT_MSG') {
			let name = 'UNKNOWN NAME';
			if (this.friends.has(id)) {
				name = this.friends.get(id).name;
			}
			console.log(name + ": " + msg);
		}
	}

	createFriend(id) {
		const friend = new Friend(this.steamFriends, id, this.steamFriends.personaStates[id]);
		this.friends.set(id, friend);
	}

	get(idOrName) {
		if (this.friends.has(idOrName)) {
			return this.friends.get(idOrName);
		} else {
			for (const friend of this.friends) {
				if (friend.name === idOrName) {
					return friend;
				}
			}
		}
		return null;
	}

	getOnline() {
		let online = [];
		for(const [id, friend] of this.friends) {
			if (friend.state !== 'OFFLINE') {
				online.push(friend.displayName());
			}
		}
		return online.join('\n');
	}
}

module.exports = Friends;
