// console log with colors
// some of the files contain cl();
// shorthand for console.log();
function logAlias(toLog) {
    console.log(`\x1b[33m${toLog}\x1b[0m`);
}
module.exports = logAlias;