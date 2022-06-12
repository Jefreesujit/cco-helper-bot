const fetch = require('node-fetch');
const { getChannelsList } = require('../services');
const client = require('../services/initClient');


const eventsUrl = 'https://discord.com/api/webhooks/960510239554293820/5phUsCh4IHKTuL0XNLbKZ_LEpEhTV-cXQa-8X-afCK5iHPZrKVPCXAVfLfh_f5xetOFS';

// personal server
// const hookUrl = 'https://discord.com/api/webhooks/960510239554293820/5phUsCh4IHKTuL0XNLbKZ_LEpEhTV-cXQa-8X-afCK5iHPZrKVPCXAVfLfh_f5xetOFS';
// const role = '<@&962215054005141575>';
// const epicHookUrl = hookUrl;
// const epicRole = role;

// fried rice server
const hookUrl = 'https://discord.com/api/webhooks/963049861220032582/0560pIXdu5ScAXDLBsbT7xaHkzeuMhn8lEXcE6BDEQvXr2MOwOuvbniJDFsnUR9c8qtr';
const epicHookUrl = 'https://discord.com/api/webhooks/967021622114541588/QbMlOufMfeTYHCmD5xaVF0JGypen0AQdU15m8HShKwkFG0CUn_A5mp32m49oLMn1VmGE';
const role = '<@&960109485618241587>';
const epicRole = '<@&967021002678738944>';

// buff to be looked for
const buffPrefix = 'calibration';
const caliSafetyPrefix = 'safety';
const epicPrefix = 'received epic';

let messageCtx = [], isTimeoutActive = false, buffVal = 0;

const delay = async (timer = 5000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(timer);
    }, timer);
  });
}

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
const pushEvents = (eventText, eventType) => {
  return new Promise((resolve, reject) => {
    getChannelsList(eventType).then((channelList) => {
      // console.log('channelList', channelList);
      const messageList = [];
      client.channels.cache.forEach(channel => {
        // console.log('channel', channel);
        if (channel.type === 'text' && channelList.includes(channel.id)) {
          channel.send(eventText).then((response) => {
            // console.log('response', response);
            messageList.push(response);
            resolve(response);
          }).catch(e => {
            console.log(e);
            reject('Push Failure');
          });
        }
      })
    });
  })
};

const trackEpicDrop = async (eventText) => {
  const response = await pushEvents(eventText, 'epic');
  console.log('track epic', response);
  // fetch(`${epicHookUrl}?wait=true`, {
  //   method: 'POST',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ content: eventText })
  // });
};


// Send message to bot
const sendMessage = async (message) => {
  const response = await pushEvents(eventText, 'cali');
  console.log('track cali', response);
  // const rawResponse = await fetch(`${hookUrl}?wait=true`, {
  //   method: 'POST',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ content: message })
  // });
  // const content = await rawResponse.json();
  // console.log('response', content);
  // return content;
};

// Update existing message if messageId already present
const updateMessage = async (messageText) => {
  messageCtx.forEach((message) => {
    message.edit(messageText).then(msg => console.log('updated', msg.id));
  })
  // const rawResponse = await fetch(`${hookUrl}/messages/${msgId}`, {
  //   method: 'PATCH',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ content: message })
  // });
  // const content = await rawResponse.json();
  // return content;
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
      message = formatBuffMessage(tBuffName, buffScore, role, activatedBy)
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

  // Callback handler for observed dom mutations
const messageHandler = async (event) => {
  const message = getMessage(event.record);
  if (message) {
    if (messageCtx.length) {
      console.log('updateMessage', message);
      const msg = await updateMessage(message);
    } else {
      console.log('sendMessage', message);
      const msgList = await sendMessage(message);
      messageCtx.push(msg);
    }
  }
  // Persist the messageId for 4 minutes when new matching buff is added.
  // Whenever a buff is added within that time, update existing message with this messageId
  // Erase the messageId after 4 minutes (active buff time) and push upcoming event as new buffs
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
