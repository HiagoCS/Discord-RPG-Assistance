module.exports = (interaction, player) =>{
		const all_embeds = []
		let i  = 0;
		for(let key in player.skills){
			if(!all_embeds[Math.floor(i/25)]){
				all_embeds.push({
					"title":"『  Perícias  』",
					"color":[255, 0, 0],
					"thumbnail":{
						"url": player.image
					},
					"fields": []
				});
			}
			var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
			var numMix = Math.floor(Math.random() * colorMix.length);
			all_embeds[Math.floor(i/25)].fields[i] = {
				name: `__**${player.skills[i].name.substr(0, 1).toUpperCase()+player.skills[i].name.substr(1, player.skills[i].name.length)}**__`,
				value: colorMix[numMix]+player.skills[i].maxValue+'\n```',
				inline: true
			}
			i++
		}
		return all_embeds;
}