const fetch = require('node-fetch');
const { getChannelsList } = require('../services');
const client = require('../services/dsClient');

// personal server
// const role = '<@&962215054005141575>';
// const epicRole = role;

// fried rice server
const role = '<@&960109485618241587>';
const epicRole = '<@&967021002678738944>';

// buff to be looked for
const buffPrefix = 'calibration';
const caliSafetyPrefix = 'safety';
const epicPrefix = 'received epic';

let messageCtx = [], isTimeoutActive = false, buffVal = 0;

// calculate the buff score from percentage
// Contribution credits: Rejid
const getBuffScoreFromPerc = (percent) => {
  if (percent >= 666) {
    return "+10 Cali";
  }
  if (percent >= 400) {
    return "+9 Cali";
  }
  if (percent >= 200) {
    return "+8 Cali";
  }
  if (percent >= 150) {
    return "+7 Cali";
  }
  if (percent >= 100) {
    return "+6 Cali";
  }
  if (percent >= 50) {
    return "+5 Cali";
  }
  if (percent >= 15) {
    return "+4 Cali";
  }
  if (percent >= 10) {
    return "+3 Cali";
  }
  if (percent >= 5) {
    return "+2 Cali";
  }
  return "100% No Break";
};

// Iterate through each active buffs to check for matching buff name
// Fetch the percentage score for each buff and sum it up
const getBuffPerc = (messageText) => {
  const buffPerc = messageText.substring(messageText.indexOf('Calibration'), messageText.indexOf(')') + 1);
  buffVal += parseInt(buffPerc.replace(/[^0-9]/g, ''), 10);
  console.log('current buffVal', buffVal);
  return [buffVal, buffPerc];
};

// Experimental : Push all events to another events bot
const pushEvents = async (eventText, eventType) => {
  const channelList = await getChannelsList(eventType);
  // console.log('channelList', channelList);
  const allowedChannels = client.channels.cache;
  const messageList = [];
  for (let [id, channel] of client.channels.cache) {
    if (channel.type === 'text' && channelList.includes(id)) {
      // console.log('channel', channel);
      const response = await channel.send(eventText);
      messageList.push(response);
    }
  }

  return messageList;
};

const trackEpicDrop = async (eventText) => {
  const response = await pushEvents(eventText, 'epic');
  console.log('track epic', response);
  return response;
};


// Send message to bot
const sendMessage = async (message) => {
  const response = await pushEvents(message, 'cali');
  console.log('track cali', response);
  return response;
};

// Update existing message if messageCtx already present
const updateMessage = async (messageText) => {
  for (let message in messageCtx) {
    const response = await message.edit(messageText);
    console.log('Updated', message.id);
  }

  return messageCtx;
};

const formatBuffMessage = (name, type, role, person) => {
  return `**Buff Name**: *${name}* \n**Buff Value**: ${type} (estimated)\n**Mentions**: ${role} @here \n**Activated By**: *${person}*`;
}

const getPlayerName = (messageText) => {
  let playerName = '';
  if (messageText.indexOf('$!{player:') !== -1) {
    const rawPlayerName = messageText.substring(messageText.indexOf('%7B'), messageText.indexOf('%7D') + 3);
    const player = JSON.parse(decodeURIComponent(rawPlayerName));
    playerName = player.n;
  }

  return playerName;
}

const handleEpicDrop = (epicText) => {
  const receivedBy = getPlayerName(epicText);
  const epicName = epicText.substring(epicText.toLowerCase().indexOf('epic'), epicText.length - 1);
  const formattedName = epicName.charAt(0).toUpperCase() + epicName.slice(1);
  const epicMsg = `**Epic Name**: *${formattedName}* \n**Received By**: *${receivedBy}* \n**Mentions**: ${epicRole} `;
  console.log('epicMsg', epicMsg);
  trackEpicDrop(epicMsg);
}

  // Listen for observed dom mutations and check for matching buff names
  // Fetch required metadata, construct request payload for sending message to bot
const getMessage = (record) => {
  let message = '', eventType = 'buffs';
  const buffText = record.message;
  // for calibration score
  if (buffText.toLowerCase().includes(buffPrefix) && !buffText.toLowerCase().includes(caliSafetyPrefix)) {
    const activatedBy = getPlayerName(buffText);
    message = `${role} Buff Added `;
    // eventType = 'cali';
    try {
      const [tBuffPerc, tBuffName] = getBuffPerc(buffText);
      const buffScore = getBuffScoreFromPerc(tBuffPerc);
      message = formatBuffMessage(tBuffName, buffScore, role, activatedBy);
    } catch (e) {
      console.log('Failed fetching buff percenatage', e);
    }
  }
  // for cali safety nano bot
  if (buffText.toLowerCase().includes(caliSafetyPrefix)) {
    // eventType = 'cali';
    const activatedBy = getPlayerName(buffText);
    const msgText = formatBuffMessage('Cali Safety Nano Bot', '100% No Break', role, activatedBy);
    sendMessage(msgText);
  }
  // for epic drops
  if (buffText.toLowerCase().includes(epicPrefix)) {
    // eventType = 'epic';
    handleEpicDrop(buffText);
  }
  console.log(buffText);
  pushEvents(buffText, eventType);
  return message;
};

  // Callback handler for listened websocket events
const messageHandler = async (event) => {
  const message = getMessage(event.record);
  if (message) {
    if (messageCtx.length) {
      console.log('updateMessage', message);
      const msgList = await updateMessage(message);
    } else {
      console.log('sendMessage', message);
      const msgList = await sendMessage(message);
      messageCtx = msgList;
    }
  }
  // Persist the message context for 4 minutes when new matching buff is added.
  // Whenever a buff is added within that time, update existing message with this message context
  // Erase the message context after 4 minutes (active buff time) and push upcoming event as new buffs
  if (messageCtx.length && !isTimeoutActive) {
    isTimeoutActive = true;
    setTimeout(() => {
      console.log('messageCtx', messageCtx)
      messageCtx = [];
      buffVal = 0;
      isTimeoutActive = false;
    }, 240000);
  }
};

module.exports = {
  messageHandler,
  pushEvents
};
