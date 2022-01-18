const {pagination} = require('reconlx');

module.exports = (interaction, player_card, player) =>{
	const pages = [player_card.status, player_card.attr, player_card.skill];
	pagination({
		embeds: pages,
		message: interaction,
		fastSkip: true,
		pageTravel: true,
		channel: interaction.channel,
		author: interaction.user
	});
}