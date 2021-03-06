# steam-chat
Steam chat for shell/terminal/command line for people who don't want to install steam but still
want to chat but also don't want to use web browser steam for some reason.

## Usage
1. Clone the repository
2. Create a file `auth.json` with your username and password in it e.g. `{"username":"me","password":"hunter2"}`
3. Try running the example via `node example.js` - you might get a STEAM GUARD, CHECK EMAIL error
4. Take the code from the Steam email you should receive and add it to `auth.json` e.g. `{...,"auth":"code"}`
5. Run the example file again and you should be logged in

Debug window with friendlist minimized           | Talking with someone with friendlist open
:-----------------------------------------------:|:-----------------------------------------------:
![sample image](https://i.imgur.com/DKRPe7T.png) |![another image](https://i.imgur.com/T5dVrpn.png)

## Other things
* As of node v10.0.0, `node-tput` cannot be compiled properly so it has been moved to a peer dependency.
And I threw in some workaround.

* As of 2018 July 12, the steam servers are kind of messed up. I put a workaround but servers
are kind of unstable so it might have to try connecting a lot.

### Features
- Chat with your steam friends
- Unread message notifications

### Known Issues
- Unicode breaks the alignment

### Planned
- ~~Refactoring the ugly draw UI code~~
- ~~Saving chat history~~
