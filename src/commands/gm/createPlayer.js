const Command = require('../../structures/Command');

module.exports = class extends Command{
	constructor(client){
		super(client, {
			name: 'cp',
			description: 'Inicia a criação de um personagem.'
		})
	}

	run = (interaction) =>{
		interaction.reply("COMANDO N CONSTRUIDO");
	}
}