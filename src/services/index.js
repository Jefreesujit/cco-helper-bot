const Database = require("@replit/database");
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

const getGangDetails = () => {
  console.log(arguments);
  return arguments;
}

module.exports = {
  trackEventInChannel,
  getGangDetails,
  getChannelsList,
  unTrackEventInChannel
}
