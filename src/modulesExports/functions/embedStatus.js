module.exports = (interaction, player) =>{
	const all_embeds = []
	let i  = 0;
	for(let key in player.status){
		if(!all_embeds[Math.floor(i/25)]){
			all_embeds.push({
				"author":{
						"name":`『📝 ${player.name.substr(0,1).toUpperCase()+player.name.substr(1, player.name.length)} 📝』`,
				},
				"color":[0, 0, 255],
				"image":{
					"url": player.image
				},
				"fields": []
			});
		}
		var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
		var numMix = Math.floor(Math.random() * colorMix.length);
		all_embeds[Math.floor(i/25)].fields[i] = {
			name: `__**${player.status[i].name.substr(0, 1).toUpperCase()+player.status[i].name.substr(1, player.status[i].name.length)}**__`,
			value: colorMix[numMix]+player.status[i].value+'/'+player.status[i].maxValue+'\n```'
		}
		i++
	}
	return all_embeds;
}