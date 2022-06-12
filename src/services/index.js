const Database = require("@replit/database");
const db = new Database();

const trackEventInChannel = (channelTag, eventType) => {
  return new Promise((resolve, reject) => {
    db.get(eventType).then(value => {
      let channelList = value || [];
      const channelId = channelTag.replace(/[^0-9]/g, '');
      if (!channelList.includes(channelId)) {
        channelList.push(channelId);
      }
      db.set(eventType, channelList).then(() => {
        resolve(channelTag);
      }).catch((e) => {
        reject(e);
      });
    }).catch((e) => {
      reject(e);
    });
  });
}

const unTrackEventInChannel = (channelTag, eventType) => {
  return new Promise((resolve, reject) => {
    db.get(eventType).then(value => {
      let channelList = value || [];
      console.log('existing channelLists', channelList);
      const channelId = channelTag.replace(/[^0-9]/g, '');
      if (channelList.includes(channelId)) {
        const index = channelList.indexOf(channelId);
        channelList.splice(index, 1);
      }
      db.set(eventType, channelList).then(() => {
        resolve(channelTag);
      }).catch((e) => {
        reject(e);
      });
    }).catch((e) => {
      reject(e);
    });
  });
}

const getChannelsList = (eventType) => {
  return new Promise((resolve, reject) => {
    db.get(eventType)
      .then(value => {
        let channelList = value || [];
        resolve(channelList);
      }).catch((e) => {
        console.log('repl error', e);
        reject('Database Error');
      });
  });
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
