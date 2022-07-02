const http = require('http');
const Discord = require('discord.js');
const { WebSocket } = require("ws");
require('dotenv').config();

const { prefix } = require('./config.json');
const resolvers = require('./src/resolvers');
const { messageHandler, pushEvents } = require('./src/handlers');
const client = require('./src/services/dsClient');

const sid = process.argv[2];

const ws = new WebSocket(`wss://prod.cybercodeonline.link/socket.io/?EIO=4&transport=websocket&sid=${sid}`);
const send = (msg) => ws.send(msg, () => console.log(`sent ${msg}`));

ws.on('open', () => {
	console.log('open');
	send("2probe")
});

ws.on('message', (data, rest) => {
	console.log(`received ${data} ${rest}`);
	if (data == "3probe") { send("5"); }
	if (data == "2") { send("3"); }
	if (data.indexOf("42[") === 0) {
		const rawMessage = data.slice(2);
		const [code, messageObj] = JSON.parse(rawMessage);
		console.log('messageObj', messageObj);
		messageHandler(messageObj);
	}
});

ws.on("error", (...x) => console.log("error", ...x));
ws.on("close", (val, buff) => console.log("close", val, buff));
ws.on("upgrade", (...x) => console.log("upgrade", x[0].statusMessage));


client.commands = new Discord.Collection();

for (const key in resolvers) {
  const command = resolvers[key];
  client.commands.set(command.name, command);
}

client.once('ready', async () => {
	console.log('CCO Helper Bot Server Ready!');
	// const response = await pushEvents('Hello epic test', 'epic');
	// console.log('push response', response);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

http.createServer(function (req, res) {
	res.write("I'm alive"); res.end();
}).listen(8080);
