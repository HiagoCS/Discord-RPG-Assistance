const {MessageActionRow, MessageButton} = require('discord.js');
const selectEmbeds = new MessageActionRow()
	.addComponents(
		new MessageButton()
		.setCustomId('status')
		.setLabel('STATUS')
		.setStyle('PRIMARY'),
		new MessageButton()
		.setCustomId('attr')
		.setLabel('ATRIBUTOS')
		.setStyle('SUCCESS'),
		new MessageButton()
		.setCustomId('skills')
		.setLabel('PERICIAS')
		.setStyle('DANGER'));

module.exports = selectEmbeds;