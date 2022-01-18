const {MessageActionRow, MessageButton} = require('discord.js');
const Save_Edit_Delete = new MessageActionRow()
	.addComponents(
		new MessageButton()
		.setCustomId('save')
		.setLabel('💾')
		.setStyle('SUCCESS'),
		new MessageButton()
		.setCustomId('edit')
		.setLabel('✏️')
		.setStyle('SECONDARY'),
		new MessageButton()
		.setCustomId('del')
		.setLabel('❌')
		.setStyle('DANGER'));

module.exports = Save_Edit_Delete;