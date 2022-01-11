//New 
require('dotenv').config();

const Client = require("./src/structures/Client");

const bot = new Client({
	intents:[
		'GUILDS',
		'GUILD_MESSAGE_REACTIONS',
		'GUILD_MESSAGES',
		'GUILD INVITES',
		'GUILD_VOICE_STATES',
		'GUILD_MEMBERS',
		'GUILD PRESENCES'
	]
})
