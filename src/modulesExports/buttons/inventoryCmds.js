const {MessageActionRow, MessageButton} = require('discord.js');

const inventoryCmd = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('add')
			.setLabel('➕ Adicionar ➕')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('show')
			.setLabel('💻 Exibir 💻')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId('rm')
			.setLabel('➖ Remover ➖')
			.setStyle('DANGER'),
		new MessageButton()
			.setCustomId('edit')
			.setLabel('📝 Editar 📝')
			.setStyle('SECONDARY')
			);
module.exports = inventoryCmd;