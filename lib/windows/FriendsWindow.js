const Window = require('./Window');
const enums = require('../res/enums.json');

class FriendsWindow extends Window {
    constructor(friends, manager, id) {
        super(manager, id);
        this.friends = friends;
        this.indexFriend = new Map();
        // set debug window things
        this.indexFriend.set('0', '0');
    }

    content() {
        const initialValue = {
            bystatus: [[' Online'], [' Offline'], [' Other', '   0 Debug']],
            count: 1
        }
        const friendValues = Object.values(this.friends)
        const reducer = ({bystatus: [online, offline, other], count}, friend) => {
            const playing = friend.game_name ? ('playing ' + friend.game_name) : '[' + enums.PersonaState[friend.status] + ']';
            const unreadMessagesCount = this.manager.windows.get(friend.steam_id).unreadMessages;
            const unread = unreadMessagesCount > 0 ? ` [${unreadMessagesCount} UNREAD!]` : '';
            if (friend.status !== 0){
                return {
                    bystatus: [
                        [...online, `  ${count}  ${friend.name}  ${playing}  ${unread}`],
                        offline,
                        other
                    ],
                    count: count + 1
                }
            } else {
                return {
                    bystatus: [
                        online,
                        [...offline, `  ${count}  ${friend.name}`],
                        other
                    ],
                    count: count + 1
                }
            }
        };
        const { bystatus: [online, offline, other] } = friendValues.reduce(reducer, initialValue);
        return other.concat(online, offline)
    }

    peek() {
        const stats = Object.values(this.friends).reduce((acc, e) => {
            e.status !== 0 ? acc.online++ : acc.offline++;
            acc.unread += this.manager.windows.get(e.steam_id).unreadMessages;
            return acc;}, {online: 0, offline: 0, unread: 0});
        return [' Online: ' + stats.online, ' Offline: ' + stats.offline,
            ' Unread Messages: ' + stats.unread];
    }
}

module.exports = FriendsWindow;
