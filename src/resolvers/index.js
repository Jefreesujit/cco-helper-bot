const common = require('./common');
const guild = require('./guild');
const track = require('./track');
const untrack = require('./untrack');
const help = require('./help');
const configure = require('./configure');

module.exports = {
  track,
  guild,
  help,
  configure,
  untrack,
  ...common
};
