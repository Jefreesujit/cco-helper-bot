const Discord = require('discord.js');
const { prefix } = require('../../config.json');
const { trackEventInChannel, setRoleForChannel } = require('../services');

module.exports = {
	name: 'track',
	description: 'Track events in game',
  options: ['epic', 'cali', 'buffs'],
  guildOnly: true,
  usage: '<option> <channel> <role>',
	execute(message, args) {
    if (!args.length) {
      return message.channel.send(`Your name: ${message.author.username}\nYour ID: ${message.author.id}`);
    }

    const option = args.shift().toLowerCase();
    if (args.length < 1 || !this.options.includes(option)) {
      return message.reply(`Invalid command, try \`${prefix}help track\``);
    }

    const name = args[0];
    const role = args[1];
    console.log('channel and role', name, role);
    trackEventInChannel(name, option).then(() => {
      if (role) {
        setRoleForChannel(role, name, option).then(() => {
          message.channel.send(`Tracking ${option} in channel ${name} with role ${role}`);
        });
      } else {
        message.channel.send(`Tracking ${option} in channel ${name}..`);
      }
    })
	},
};
