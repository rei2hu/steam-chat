// box drawing unicode labled by their 'outputs'
// in the order up down left right
const tput = require('node-tput');

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

function setup() {
	process.stdout.write(tput('civis'));
}

function print(str) {
	process.stdout.write(tput('cup', 0, 0));
	str = str.split('\n').map(e => e + ' '.repeat(process.stdout.columns - e.length)).join('\n');
	process.stdout.write(str);
}

function formatAndPrint(titleString, tabsArray, currentWindowString, innerTextArray, helpString, promptString) {
	let tabsString = ud + ' ' + tabsArray.join(' ' + ud + ' ') + ' ' + ud;
	let aboveTabsString = dr;
	for (let i = 1; i < tabsString.length - 1; i++) {
		if (tabsString[i] === ud) {
			aboveTabsString += dlr;
		} else {
			aboveTabsString += lr;
		}
	}
	aboveTabsString += dl;
	currentWindowString = ud + ' ' + currentWindowString + ' ' + ud;
	const belowTabsStringLength = Math.max(currentWindowString.length, tabsString.length);
	let belowTabsString = udr;
	for (let i = 1; i < belowTabsStringLength - 1; i++) {
		if (tabsString[i] === ud) {
			if (i === currentWindowString.length - 1) {
				belowTabsString += udlr;
			} else {
				belowTabsString += ulr;
			}
		} else if (i === currentWindowString.length - 1) {
			belowTabsString += dlr;
		} else {
			belowTabsString += lr;
		}
	}
	if (belowTabsStringLength === currentWindowString.length) {
		if (tabsString.length === currentWindowString.length) {
			belowTabsString += udl;
		} else {
			belowTabsString += dl;
		}
	} else {
		belowTabsString += ul;
	}
	let belowCurrentString = udr + lr.repeat(currentWindowString.length - 2) + ul;
	innerTextArray = innerTextArray.map(e => (!e.startsWith('[') ? ud : udr) + ' ' + e);
	let innerTextString = innerTextArray.join('\n');
	let aboveHelpString = udr + lr.repeat(helpString.length + 2) + dl;
	helpString = ud + ' ' + helpString + ' ' + ul;
	promptString = ur + lr + ' ' + promptString;

	/*
	console.log('  ' + titleString);
	console.log(aboveTabsString);
	console.log(tabsString);
	console.log(belowTabsString);
	console.log(currentWindowString);
	console.log(belowCurrentString);
	console.log(innerTextString);
	console.log(aboveHelpString);
	console.log(helpString);
	process.stdout.write(promptString);
	process.stdout.write(tput('cup', '0', '0'));
	*/
	let str = '  ' +
		titleString         + '\n' +
		aboveTabsString     + '\n' +
		tabsString          + '\n' +
		belowTabsString     + '\n' +
		currentWindowString + '\n' +
		belowCurrentString  + '\n' +
		innerTextString     + '\n' +
		aboveHelpString     + '\n' +
		helpString          + '\n' +
		promptString;
	print(str);
}

module.exports = {formatAndPrint, setup};














