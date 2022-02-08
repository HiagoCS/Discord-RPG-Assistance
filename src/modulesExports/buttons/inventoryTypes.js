const {MessageActionRow, MessageButton} = require('discord.js');

const inventoryTypes = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('gun')
			.setLabel('🔫 Arma de fogo 🔫')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('melle')
			.setLabel('⚔️ Arma Corpo-a-Corpo ⚔️')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId('coin')
			.setLabel('💰 Moeda 💰')
			.setStyle('SECONDARY'),
		new MessageButton()
			.setCustomId('bag')
			.setLabel('🎒 Mochila 🎒')
			.setStyle('DANGER')
			);
module.exports = inventoryTypes;