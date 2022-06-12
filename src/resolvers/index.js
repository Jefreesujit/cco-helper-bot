const common = require('./common');
const guild = require('./guild');
const track = require('./track');
const help = require('./help');

module.exports = {
  track,
  guild,
  help,
  ...common
};
