const {MessageActionRow, MessageButton} = require('discord.js');

const paginationButtons = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('first')
			.setLabel('⬅️')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId('prev')
			.setLabel('◀️')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId('next')
			.setLabel('▶️')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId('end')
			.setLabel('➡️')
			.setStyle('PRIMARY')
			);
module.exports = paginationButtons;