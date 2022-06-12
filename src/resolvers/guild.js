const Discord = require('discord.js');
const { prefix } = require('../../config.json');
const { getGangDetails } = require('../services');

module.exports = {
	name: 'gang',
	description: 'Display info about this gang.',
  options: ['stats', 'topcontribs'],
  guildOnly: true,
  usage: '<option> <name>',
	execute(message, args) {
    if (!args.length) {
      return message.channel.send(`**Gang name**: ${message.guild.name}\n **Total members**: ${message.guild.memberCount}`);
    }

    const option = args.shift().toLowerCase();
    if (args.length === 0 || !this.options.includes(option)) {
      return message.reply(`Invalid command, try \`${prefix}help gang\``);
    }

    const name = args.join('+');
    if (option === 'stats') {
      getGangDetails(name).then((data) => {
        const guildDetails = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Gang Info')
              .setThumbnail('https://i.imgur.com/BgWeozT.png')
              .addFields(
                { name: 'Gang Name', value: data.Name },
                { name: '\u200B', value: '\u200B' },
                { name: 'Founder', value: data.FounderName },
                { name: 'Tag', value: data.AllianceTag },
                { name: 'Members', value: data.MemberCount },
                { name: 'Gang Level', value: data.killFame },
                )
              .setTimestamp()
              .setFooter('CCO Helper bot', 'https://i.imgur.com/BgWeozT.png');

        message.channel.send(guildDetails);
      });
    } else if (option === 'topcontribs') {
      message.channel.send(`Getting top contributors for ${name}..`);
    }
	},
};
