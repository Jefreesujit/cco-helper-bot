const Discord = require('discord.js');
const { prefix, icon } = require('../../config.json');
const { getGangDetails, getGangTopContribs } = require('../services');
var AsciiTable = require('ascii-table')

module.exports = {
	name: 'gang',
	description: 'Display info about this gang.',
  options: ['stats', 'topxpcontrib', 'toprescontrib', 'topoccucontrib'],
  guildOnly: true,
  usage: '<option>',
	execute(message, args) {
    if (!args.length) {
      return message.channel.send(`**Gang name**: ${message.guild.name}\n **Total members**: ${message.guild.memberCount}`);
    }

    const option = args.shift().toLowerCase();

    if (!this.options.includes(option)) {
      return message.reply(`Invalid command, try \`${prefix}help gang\``);
    }

    const guildId = message.guild.id;

    if (option === 'stats') {
      getGangDetails(guildId).then((data) => {
        console.log('data', data);
        const guildDetails = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(data.name)
          .setThumbnail(data.image || icon)
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Gang Tag', value: data.shortName.toUpperCase() },
            { name: 'Description', value: data.description },
            { name: 'Gang Level', value: data.level },
            { name: 'Resource', value: data.resource },
            { name: 'Gang Exp', value: data.exp },
            { name: 'BTC Balance', value: data.balance },
            { name: 'Members', value: data.memberCount },
            )
          .setTimestamp()
          .setFooter('CCO Helper Bot', icon);

        message.channel.send(guildDetails);
      }).catch(error => {
        console.log('gang details error', error);
        message.channel.send('Error fetching gang stats, make sure your gang is configured properly.');
      });
    } else if (option === 'topxpcontrib') {
      getGangTopContribs(guildId).then((data) => {
        const sortedMembers = data.members.sort((a, b) => (b.expContribution - a.expContribution));
        const topContribs = sortedMembers.map((mem, i) => `${i + 1} ${mem.displayName} ${mem.expContribution}`).slice(0, 10);
        console.log('topcontrib xp', topContribs);

        const table = AsciiTable.factory({
          heading: ['No', 'Name', 'Exp'],
          rows: topContribs.map(member => member.split(' ')),
        });

        const guildDetails = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(data.name)
          .setThumbnail(data.image || icon)
          .addFields(
            { name: 'Top Contributors - Exp', value: "```" + table.toString() + "```" },
          )
          .setTimestamp()
          .setFooter('CCO Helper Bot', icon);

        message.channel.send(guildDetails);
      }).catch(error => {
        message.channel.send('Error fetching gang contribs, make sure your gang is configured properly.');
      });;
    } else if (option === 'toprescontrib') {
      getGangTopContribs(guildId).then((data) => {
        const sortedMembers = data.members.sort((a, b) => (b.resourceContribution - a.resourceContribution));
        const topContribs = sortedMembers.map((mem, i) => `${i + 1} ${mem.displayName} ${mem.resourceContribution}`).slice(0, 10);
        console.log('topcontrib resource', topContribs);

        const table = AsciiTable.factory({
          heading: ['No', 'Name', 'Resource'],
          rows: topContribs.map(member => member.split(' ')),
        });

        const guildDetails = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(data.name)
          .setThumbnail(data.image || icon)
          .addFields(
            { name: 'Top Contributors - Resource', value: "```" + table.toString() + "```" },
          )
          .setTimestamp()
          .setFooter('CCO Helper Bot', icon);

        message.channel.send(guildDetails);
      }).catch(error => {
        message.channel.send('Error fetching gang contribs, make sure your gang is configured properly.');
      });;
    } else if (option === 'topoccucontrib') {
      getGangTopContribs(guildId).then((data) => {
        const sortedMembers = data.members.sort((a, b) => (b.occupationContribution - a.occupationContribution));
        const topContribs = sortedMembers.map((mem, i) => `${i + 1} ${mem.displayName} ${mem.occupationContribution}`).slice(0, 10);
        console.log('topcontrib occupation', topContribs);

        const table = AsciiTable.factory({
          heading: ['No', 'Name', 'Occupation'],
          rows: topContribs.map(member => member.split(' ')),
        });

        const guildDetails = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(data.name)
          .setThumbnail(data.image || icon)
          .addFields(
            { name: 'Top Contributors - Occupation', value: "```" + table.toString() + "```" },
          )
          .setTimestamp()
          .setFooter('CCO Helper Bot', icon);

        message.channel.send(guildDetails);
      }).catch(error => {
        message.channel.send('Error fetching gang contribs, make sure your gang is configured properly.');
      });
    }
	},
};
