let tput;
try {
    require('node-tput');
    tput = (...args) => {
        return Promise.resolve(require('node-tput')(...args));
    }
} catch (e) {
    // no tput module so
    tput = (...args) => {
        return new Promise((res) => {
            require('child_process').exec('tput ' + args.join(' '), (err, stdout, stderr) => {
                if (err) {
                    // if tput ends up not working we'll just reprint the ui on the following lines
                    res('');
                } else {
                    // else we can use the escape code
                    res(stdout);
                }
            });
        });
    }
}

module.exports = tput;
