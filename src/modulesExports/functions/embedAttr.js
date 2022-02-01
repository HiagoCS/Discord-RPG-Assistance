module.exports = (interaction, player) =>{
	const all_embeds = []
	let i  = 0;
	for(let key in player.attr){
		if(!all_embeds[Math.floor(i/25)]){
			all_embeds.push({
				"title":"『  Atributos  』",
				"color":[0, 255, 0],
				"thumbnail":{
					"url": player.image
				},
				"fields": []
			});
		}
		var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
		var numMix = Math.floor(Math.random() * colorMix.length);
		all_embeds[Math.floor(i/25)].fields[i] = {
			name: `__**${player.attr[i].name.substr(0, 1).toUpperCase()+player.attr[i].name.substr(1, player.attr[i].name.length)}**__`,
			value: colorMix[numMix]+player.attr[i].maxValue+'\n```',
			inline: true
		}
		i++
	}
	return all_embeds;
}