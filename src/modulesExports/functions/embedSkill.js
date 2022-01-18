const player_card = require('../../../JSON/embeds/player_card.json');

module.exports = (interaction, player) =>{
	//EMBED PERICIAS
	player_card.skill.thumbnail.url = player.image;
	for(let i in player.skills){
		var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
		var numMix = Math.floor(Math.random() * colorMix.length);
		player_card.skill.fields[i] = {
			name: `__**${player.skills[i].name}**__`,
			value: colorMix[numMix]+player.skills[i].value+'/'+player.skills[i].maxValue+'\n```',
			inline: true
		}
	}
	return player_card.skill;
}