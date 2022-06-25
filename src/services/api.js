const fetch = require('node-fetch');

const JWT = process.env.CCO_JWT;
const apiUrl = `https://${process.env.CCO_SOCKET_URL}/rest/v1/clans?select=*&id=eq.`;

const fetchGangInfo = async (gangId = '2-XvZH') => {
  const options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  };
  const response = await fetch(`${apiUrl}${gangId}&apikey=${JWT}`);
  const [data] = await response.json();
  return data;
}

module.exports = {
  fetchGangInfo
};
