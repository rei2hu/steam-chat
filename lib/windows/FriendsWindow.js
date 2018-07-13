const Window = require('./Window');

class FriendsWindow extends Window {
    constructor(friends, manager, id) {
        super(manager, id);
        this.friends = friends;
        this.indexFriend = new Map();
        // set debug window things
        this.indexFriend.set('0', '0');
    }

    content() {
        let online = [' Online'];
        let offline = [' Offline'];
        let i = 1;
        for (const friendId in this.friends) {
            const friend = this.friends[friendId];
            // is online
            if (friend.status !== 0) {
                online.push('   ' + i + ' ' + friend.name + ' ' + (friend.game_name ? ('playing ' + friend.game_name)
                    : friend.status) + (this.manager.windows.get(friendId).unreadMessages > 0 ? '[UNREAD!]' : ''));
            } else {
                offline.push('   ' + i + ' ' + friend.name);
            }
            this.indexFriend.set(i + '', friendId);
            i++;
        }
        return [' Other', '   0 Debug'].concat(online, offline);
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
