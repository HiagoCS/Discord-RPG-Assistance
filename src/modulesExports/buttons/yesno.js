const {MessageActionRow, MessageButton} = require('discord.js');

const YesNo = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('yes')
			.setLabel('Sim')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('no')
			.setLabel('Não')
			.setStyle('DANGER')
			);
module.exports = YesNo;