const player_card = require('../../../JSON/embeds/player_card.json');

module.exports = (interaction, player) =>{
	//EMBED ATRIBUTOS
	player_card.attr.thumbnail.url = player.image;
	for(let i in player.attr){
		var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
		var numMix = Math.floor(Math.random() * colorMix.length);
		player_card.attr.fields[i] = {
			name: `__**${player.attr[i].name}**__`,
			value: colorMix[numMix]+player.attr[i].value+'/'+player.attr[i].maxValue+'\n```',
			inline: true
		}
	}
	return player_card.attr;
}