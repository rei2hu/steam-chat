# steam-chat
Steam chat for shell/terminal/command line for people who don't want to install steam but still
want to chat but also don't want to use web browser steam for some reason.

Requires at least a width of 85 characters horizontally and like 15 characters vertically to even
begin to draw the UI properly.

![sample image](https://i.imgur.com/FIshw7u.png)

## Other things
* As of node v10.0.0, `node-tput` cannot be compiled prpperly so it has been moved to a peer dependency. 

* You might see socket timed out a lot as of 2018 July 12. That's because the server list of a module I'm using
seems to be outdated. I took the liberty of looking at some network traffic and figuring out a new IP. You can fix
it yourself easily by going to around line 30 in `node_modules/steam/lib/steam_client.js` and adding/modifying
that line to be
```
server = {host: "155.133.254.133", port: "27018"}
```

### Features
- Chat with your online friends
- Shows unread message notifications as in there is an asterisk in the tab with unread messages.

### Known Issues
- Unicode breaks the alignment
- Too many friends online will also break the alignment (probably)
- ~~If the screen is redrawn (any update) while typing, you lose sight of your current input~~

### Not tested yet
- Friends removing you and stuff

### Planned
- ~~Refactoring the ugly draw UI code~~
- ~~Saving chat history~~
- Custom input handling
- Custom 'window; formatting
