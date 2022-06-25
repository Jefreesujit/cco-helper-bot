const Database = require("@replit/database");
const { fetchGangInfo } = require('./api');
const db = new Database();

const trackEventInChannel = async (channelTag, eventType) => {
  const value = await db.get(eventType);
  let channelList = value || [];
  const channelId = channelTag.replace(/[^0-9]/g, '');
  if (!channelList.includes(channelId)) {
    channelList.push(channelId);
  }
  await db.set(eventType, channelList);
  return channelTag;
}

const setRoleForChannel = async (roleId, channelTag, eventType) => {
  const value = await db.get(`${eventType}Role`);
  let channelMap = value || {};
  const channelId = channelTag.replace(/[^0-9]/g, '');
  channelMap[channelId] = roleId;
  await db.set(`${eventType}Role`, channelMap);
  return roleId;
}

const unTrackEventInChannel = async (channelTag, eventType) => {
  const value = await db.get(eventType);
  let channelList = value || [];
  const channelId = channelTag.replace(/[^0-9]/g, '');
  if (channelList.includes(channelId)) {
    const index = channelList.indexOf(channelId);
    channelList.splice(index, 1);
  }
  await db.set(eventType, channelList);
  return channelTag;
}

const getChannelsList = async (eventType) => {
  const value = await db.get(eventType);
  const channelList = value || [];
  return channelList;
}

const getRolesMap = async (eventType) => {
  const value = await db.get(`${eventType}Role`);
  let rolesMap = value || {};
  return rolesMap;
}

const assignGuildToGang = async (discordGuild, gangId) => {
  const value = await db.get('gang');
  const gangMap = value || {};
  gangMap[discordGuild] = gangId;
  await db.set('gang', gangMap);
}

const getGangDetails = async (guildId) => {
  const gangMap = await db.get('gang');
  const gangId = gangMap[guildId];
  const gangDetails = await fetchGangInfo(gangId);
  const members = Object.keys(gangDetails.members);
  return {
    name: gangDetails.displayName,
    shortName: gangDetails.shortName,
    description: gangDetails.motto,
    level: gangDetails.level,
    resource: gangDetails.resource,
    balance: gangDetails.money,
    memberCount: members.length,
    exp: gangDetails.exp,
    image: gangDetails.image,
  };
}

const getGangTopContribs = async (guildId) => {
  const gangMap = await db.get('gang');
  const gangId = gangMap[guildId];
  const gangDetails = await fetchGangInfo(gangId);
  const members = Object.values(gangDetails.members);
  const sortedMembers = members.sort((a, b) => (b.expContribution - a.expContribution));
  return {
    name: gangDetails.displayName,
    image: gangDetails.image,
    members: sortedMembers,
  };
}

module.exports = {
  trackEventInChannel,
  getGangDetails,
  getChannelsList,
  unTrackEventInChannel,
  assignGuildToGang,
  getGangTopContribs,
  getRolesMap,
  setRoleForChannel,
}
