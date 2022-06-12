require('dotenv').config();
const http = require('http');
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const resolvers = require('./src/resolvers');
const { RealtimeClient } = require('@supabase/realtime-js');
const { messageHandler, pushEvents } = require('./src/handlers');
const client = require('./src/services/initClient');


const JWT = process.env.CCO_JWT;
const socketUrl = `wss://${process.env.CCO_SOCKET_URL}/realtime/v1/websocket?apikey=${JWT}&vsn=1.0.0`;

var socket = new RealtimeClient(socketUrl);

socket.connect();

socket.onOpen(() => console.log('Socket opened.'));
socket.onClose(() => console.log('Socket closed.'));
socket.onError((e) => console.log('Socket error', e));

var channel = socket.channel('realtime:public:chat_messages:channel=eq.S', { user_token: JWT })

// channel.on('*', msg => console.log('*', msg))
channel.on('INSERT', msg => messageHandler(msg));
channel.on('UPDATE', msg => console.log('UPDATE', msg))
channel.on('DELETE', msg => console.log('DELETE', msg))

channel
	.subscribe()
	.receive('ok', () => console.log('Connecting'))
	.receive('error', () => console.log('Failed'))
	.receive('timeout', () => console.log('Waiting...'))

// Set the JWT so Realtime can verify and keep the channel alive
socket.setAuth(JWT);

// const client = new Discord.Client();
client.commands = new Discord.Collection();

for (const key in resolvers) {
  const command = resolvers[key];
  client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('CCO Helper Bot Server Ready!');
	pushEvents('Hello epic test', 'epic');
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
