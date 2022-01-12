const Command = require('../../structures/Command');

module.exports = class extends Command {
	constructor(client){
		super(client, {
			name: 'help',
			description: 'Mostra todos os comandos do bot.'
		})
	}

	run = (interaction) => {
		const cmds = {
			color: [193, 17, 199],
			author: {
				name:this.client.user.username
			},
			description: `Comandos ${this.client.user.username}`,
			fields: []
		}
		for(let i in this.client.commands){
			cmds.fields[i] = {
				name:`**${this.client.commands[i].name}**`, 
				value:`**${this.client.commands[i].description}**`
			}
		}
		interaction.channel.send({embeds: [cmds]});
	}
}