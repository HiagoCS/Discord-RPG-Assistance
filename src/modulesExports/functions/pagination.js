const {pagination} = require('reconlx');

module.exports = (interaction, player_card, player) =>{
	const pages = [player_card.status, player_card.attr, player_card.skill];
	pagination({
		embeds: pages,
		message: interaction,
		fastSkip: true,
		channel: interaction.channel,
		author: interaction.user,
		time: 15000
	}).then(() =>{
		setTimeout(() => interaction.channel.messages.cache.first().delete(), 20000);
	}).catch((err) =>{
		console.log(err);
	});
}