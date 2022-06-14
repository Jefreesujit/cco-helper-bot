const Discord = require('discord.js');
const { prefix } = require('../../config.json');
const { trackEventInChannel } = require('../services');

module.exports = {
	name: 'track',
	description: 'Untrack events in game from a channel',
  options: ['epic', 'cali', 'buffs'],
  guildOnly: true,
  usage: '<option> <channel>',
	execute(message, args) {
    if (!args.length) {
      return message.channel.send(`Your name: ${message.author.username}\nYour ID: ${message.author.id}`);
    }

    const option = args.shift().toLowerCase();
    if (args.length !== 1 || !this.options.includes(option)) {
      return message.reply(`Invalid command, try \`${prefix}help player\``);
    }

    const name = args[0];
    console.log('channelname', name);
    if (option === 'epic') {
      trackEventInChannel(name, option).then(() => {
        message.channel.send(`Removing epic drops alerts in channel ${name}..`);
      })
    } else if (option === 'cali') {
      trackEventInChannel(name, option).then(() => {
        message.channel.send(`Removing calibration alerts in channel ${name}..`);
      })
    } else if (option === 'buffs') {
      trackEventInChannel(name, option).then(() => {
        message.channel.send(`Removing buffs/boosts alerts in channel ${name}..`);
      })
    }
	},
};
