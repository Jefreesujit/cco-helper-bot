const Discord = require('discord.js');
const { prefix, icon } = require('../../config.json');
const { getGangRankDetails, setGangRankDetails } = require('../services');
const { calculatePlayerRankings, getPlayersExp } = require('../utils');
var AsciiTable = require('ascii-table')

module.exports = {
  name: 'ranking',
  description: 'Run gang resource competitions',
  options: ['start', 'status', 'stop'],
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

    if (option === 'start') {
      getGangRankDetails(guildId).then((data) => {
        console.log('data', data);
        if (!data.ranking) {
          const startExp = getPlayersExp(data.members);
          setGangRankDetails(guildId, startExp).then((data) => {
            const msg = `Ranking started successfully at <t:${Math.round(Date.now() / 1000)}:d> \n You can track rank progress by running "!cco ranking status" command`;
            message.channel.send(msg);
          }).catch(error => {
            console.log('Start ranking error', error);
            message.channel.send('Error starting ranking, make sure your gang is configured properly.');
          });
        } else {
          message.channel.send('There is an active ranking in progress. You can track rank progress by running "!cco ranking status" command');
        }
      }).catch(error => {
        console.log('gang details error', error);
        message.channel.send('Error fetching gang stats, make sure your gang is configured properly.');
      });
    } else if (option === 'status') {
      getGangRankDetails(guildId).then((data) => {
        console.log('data', data);
        const startExp = data.ranking;
        if (startExp) {
          const currentExp = getPlayersExp(data.members);
          const rankings = calculatePlayerRankings(startExp, startExp);
          const topContribs = rankings.map((mem, i) => `${i + 1} ${mem.PlayerName} ${mem.StartExp} ${mem.CurrentExp} ${mem.ExpGain}`).slice(0, 10);
          console.log('topcontrib res', topContribs);
  
          const table = AsciiTable.factory({
            heading: ['Rank', 'Name', 'Start', 'Current', 'Gain'],
            rows: topContribs.map(member => member.split(' ')),
          });
  
          console.log(table.toString());
  
          const guildDetails = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(data.name)
            .setThumbnail(data.image || icon)
            .addFields(
              { name: 'Top Contributors ', value: "```" + table.toString() + "```" },
            )
            .setTimestamp()
            .setFooter('CCO Helper Bot', icon);
          message.channel.send(guildDetails);
        } else {
          message.channel.send('No active rankings going on. Start a ranking to see status');
        }
      }).catch(error => {
        console.log('Gang details error', error);
        message.channel.send('Error fetching gang stats, make sure your gang is configured properly.');
      });
    } else if (option === 'stop') {
      getGangRankDetails(guildId).then((data) => {
        console.log('data', data);
        const startExp = data.ranking;
        if (startExp) {
          const currentExp = getPlayersExp(data.members);
          setGangRankDetails(guildId, null).then((data) => {
            const rankings = calculatePlayerRankings(startExp, startExp);
            const topContribs = rankings.map((mem, i) => `${i + 1} ${mem.PlayerName} ${mem.StartExp} ${mem.CurrentExp} ${mem.ExpGain}`).slice(0, 10);
            console.log('topcontrib res', topContribs);
  
            const table = AsciiTable.factory({
              heading: ['Rank', 'Name', 'Start', 'Stop', 'Gain'],
              rows: topContribs.map(member => member.split(' ')),
            });
  
            console.log(table.toString());
  
            const guildDetails = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle(data.name)
              .setThumbnail(data.image || icon)
              .addFields(
                { name: 'Top Contributors ', value: "```" + table.toString() + "```" },
              )
              .setTimestamp()
              .setFooter('CCO Helper Bot', icon);
            message.channel.send(guildDetails);
            }).catch(error => {
             console.log('Stop ranking error', error);
             message.channel.send('Error starting ranking, make sure your gang is configured properly.');
           });
        } else {
          message.channel.send('No active rankings going on. Start a ranking first');
        }
      }).catch(error => {
        console.log('Gang details error', error);
        message.channel.send('Error fetching gang stats, make sure your gang is configured properly.');
      });
    }
  },
};
