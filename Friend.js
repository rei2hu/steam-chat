const { PersonaState } = require('./res/enums.json');

class Friend {
	constructor(friends, id, personaState = {}) {
		this.steamFriends = friends;
		this.id = id;;
		this.state = PersonaState[personaState.persona_state] || 'OFFLINE';
		this.name = personaState.player_name || 'UNKNOWN NAME';
		this.gameName = personaState.game_name || 'NOT PLAYING';
	}

	send(message) {
		this.steamFriends.sendMessage(this.id, message);
	}

	displayName() {
		return `[${this.id}] ${this.name} (${this.state})\n   ${this.gameName === 'NOT PLAYING' ? '' : 'playing ' + this.gameName}`
	}

	name() {
		return `[${this.id}] ${this.name}`;
	}
}

module.exports = Friend;
