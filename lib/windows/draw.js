const tput = require('./tput');

const ud   = '║';
const lr   = '═';

const ur   = '╚';
const ul   = '╝';
const dr   = '╔';
const dl   = '╗';

const ulr  = '╩';
const udr  = '╠';
const udl  = '╣';
const dlr  = '╦';

const udlr = '╬';

// content is an array of lines to print out
module.exports = async (content, friendWindow, showing, clearterm) => {
    process.stdout.write(await tput('sc'));
    if (clearterm) {
        process.stdout.write(await tput('cup', 0, 0));
        process.stdout.write(' '.repeat(process.stdout.columns).repeat(process.stdout.rows - 2));
    }
    const cols = process.stdout.columns - 2;
    process.stdout.write(await tput('cup', 0, 0));
	process.stdout.write(dr + lr.repeat(cols) + dl);
	process.stdout.write('\n');
    let i = 0;
    let friendContent;
    if (showing) {
        friendContent = friendWindow.content();
    } else {
        friendContent = friendWindow.peek();
    }
    for (; i < Math.min(process.stdout.rows - 5, friendContent.length); i++) {
        process.stdout.write(ud + friendContent[i] + ' '.repeat(cols - friendContent[i].length) + ud);
        process.stdout.write('\n');
    }
    process.stdout.write(udr + lr.repeat(cols) + ul);

    let j = i;
    for (; i < process.stdout.rows - 5; i++) {
        const c = content[i - j] || '';
		process.stdout.write(ud + c + ' '.repeat(cols - c.length + 1));
		process.stdout.write('\n');
	}
    process.stdout.write(udr + lr.repeat(cols) + dl);
    process.stdout.write('\n');
    process.stdout.write(ud + ' f {n} - change to window/toggle friendlist | m [msg] - send msg | r - redraw | ctrl + c - quit ' + ' '.repeat(cols - 96) + ul);
    process.stdout.write('\n');
    process.stdout.write(ur + ' ');
    process.stdout.write(await tput('rc'));
}
