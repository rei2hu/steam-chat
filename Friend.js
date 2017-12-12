const { PersonaState } = require('./res/enums.json');

class Friend {
	constructor(friends, id, personaState = {}, chatWindow) {
		this.steamFriends = friends;
		this.id = id;
		this.chatWindow = chatWindow;
		this.setInfo(personaState);
	}

	setInfo(personaState = {}) {
		this.state = PersonaState[personaState.persona_state] || 'OFFLINE';
		this.name = personaState.player_name || 'UNKNOWN NAME';
		this.gameName = personaState.game_name || 'NOT PLAYING';
		this.chatWindow.setInfo(this);
	}

	send(message) {
		this.steamFriends.sendMessage(this.id, message);
	}

	displayName() {
		return `[${this.id}] ${this.name} (${this.state})${this.gameName === 'NOT PLAYING' ? '' : ' playing ' + this.gameName}`
	}

	name() {
		return `[${this.id}] ${this.name}`;
	}
}

module.exports = Friend;
