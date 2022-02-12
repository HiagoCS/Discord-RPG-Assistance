const {Client} = require('discord.js');
const {readdirSync} = require('fs');
const {join} = require('path');
const botconfig = require('../../JSON/botconfig.json');
module.exports = class extends Client {
	constructor(options){
		super(options);

		this.commands = [];
		this.loadCommands();
		this.loadEvents();
	}

	registryCommands(){
		for(let i in botconfig.serversIds){
			this.guilds.cache.get(botconfig.serversIds[i]).commands.set(this.commands);
		}
	}

	loadCommands(path = 'src/commands'){
		const categories = readdirSync(path);
		
		for (const category of categories){
			const commands = readdirSync(`${path}/${category}`);

			for(const command of commands){
				const commandClass = require(join(process.cwd(), `${path}/${category}/${command}`));
				const cmd = new (commandClass)(this);
				this.commands.push(cmd);
				console.log(`Command "${cmd.name}" loaded!`);
			}
		}
	}
	loadEvents(path = 'src/events'){
		const categories = readdirSync(path);
		
		for (const category of categories){
			const events = readdirSync(`${path}/${category}`);

			for(const event of events){
				const eventClass = require(join(process.cwd(), `${path}/${category}/${event}`));
				const evt = new (eventClass)(this);
				
				this.on(evt.name, evt.run);
				console.log(`Event "${evt.name}" loaded!`)
			}
		}
	}
}
