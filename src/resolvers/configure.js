const Discord = require('discord.js');
const { prefix } = require('../../config.json');
const { assignGuildToGang } = require('../services');

module.exports = {
	name: 'configure',
	description: 'Configure info about this gang.',
  options: ['gang', 'timezone'],
  guildOnly: true,
  usage: '<option> <name>',
	execute(message, args) {
    if (!args.length) {
      return message.channel.send(`**Gang name**: ${message.guild.name}\n **Total members**: ${message.guild.memberCount}`);
    }

    const option = args.shift().toLowerCase();
    if (args.length === 0 || !this.options.includes(option)) {
      return message.reply(`Invalid command, try \`${prefix}help configure\``);
    }
    const guildId = message.guild.id;
    const name = args.join('+');
    if (option === 'gang') {
      assignGuildToGang(guildId, name).then((data) => {
        message.channel.send('Gang info configured successfully');
      })
      .catch((error) => {
        message.channel.send('Failed configuring gang, please retry with proper gang id');
      });
    } else if (option === 'timezone') {
      message.channel.send(`Setting timezone for gang..`);
    }
	},
};
