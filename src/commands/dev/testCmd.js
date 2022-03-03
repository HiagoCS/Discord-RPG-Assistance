const Command = require('../../structures/Command');
const {MessageActionRow, MessageButton} = require('discord.js');
const fs = require('fs');
const player_card = require('../../../JSON/embeds/player_card.json');
const {pagination} = require('reconlx');
const embedSkill = require('../../modulesExports/functions/embedSkill.js');
const embedAttr = require('../../modulesExports/functions/embedAttr.js');
const embedStatus = require('../../modulesExports/functions/embedStatus.js');
const showPagination = require('../../modulesExports/functions/pagination.js');

module.exports = class extends Command{
	constructor(client){
		super(client, {
			name: 'testcmd',
			description: 'Testa comandos no discord.',
		})
	}

	run = (interaction) =>{
		console.log(interaction.channel.messages.cache);
	}
}