const {pagination} = require('reconlx');
module.exports = (interaction, status, attrs, skills, player) =>{
	const pages = [];
	for(let i in status)
		pages.push(status[i]);
	for(let i in attrs)
		pages.push(attrs[i]);
	for(let i in skills)
		pages.push(skills[i]);
	pagination({
		embeds: pages,
		message: interaction,
		fastSkip: true,
		channel: interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id),
		author: interaction.user,
		time: 15000
	}).then(() =>{
		setTimeout(() => interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.bot === true).delete(), 20000);
	}).catch((err) =>{
		console.log(err);
	});
}