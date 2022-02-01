const Command = require('../../structures/Command');

module.exports = class extends Command {
	constructor(client){
		super(client, {
			name: 'help',
			description: `Mostra todos os comandos do bot.`
		})
	}

	run = (interaction) => {
		const all_embeds = []
		let i  = 0;
		for(let key in this.client.commands){
			if(!all_embeds[Math.floor(i/25)]){
				all_embeds.push({
					"color": [193, 17, 199],
					"author": {
						"name":this.client.user.username
					},
					"description": `Comandos ${this.client.user.username}`,
					"fields": []
				});
			}
			all_embeds[Math.floor(i/25)].fields[i] = {
				name: `**/${this.client.commands[i].name}**`,
				value: `__${this.client.commands[i].description}__`
			}
			i++
		}
		interaction.user.send({embeds: all_embeds});
	}
}