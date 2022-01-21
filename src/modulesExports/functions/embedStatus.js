const player_card = require('../../../JSON/embeds/player_card.json');

module.exports = (interaction, player) =>{
	//EMBED STATUS
	player_card.status.author.name = `『📝 ${player.name.substr(0,1).toUpperCase()+player.name.substr(1, player.name.length)} 📝』`;
	player_card.status.image.url =  player.image;
	for(let i in player.status){
		var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
		var numMix = Math.floor(Math.random() * colorMix.length);
		player_card.status.fields[i] = {
			name: `__**${player.status[i].name.substr(0, 1).toUpperCase()+player.status[i].name.substr(1, player.status[i].name.length)}**__`,
			value: colorMix[numMix]+player.status[i].value+'/'+player.status[i].maxValue+'\n```'
		}
	}
	return player_card.status;
}