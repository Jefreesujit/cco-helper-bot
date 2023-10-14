const common = require('./common');
const guild = require('./guild');
const track = require('./track');
const untrack = require('./untrack');
const help = require('./help');
const configure = require('./configure');
const ranking = require('./ranking');

module.exports = {
  help,
  configure,
  guild,
  ranking,
  track,
  untrack,
  ...common
};
