const embedStatus = require('../../modulesExports/functions/embedStatus.js');
module.exports = (interaction, type, item, player) =>{
	if(type == 'gun'){
		const gunEmbed = {
			"title":`『 ${item.name.substr(0,1).toUpperCase()+item.name.substr(1,item.name.length)} 』`,
			"color":[0, 255, 0],
			"image":{
				"url": `https://yt3.ggpht.com/uGlaOpQPoCNRcTIG3XDGbQsKxbQ0xenLNISYAsUFb9o9UVRgT1aZhcCm_0zKhWNr8-Nghyi865o=s88-c-k-c0x00ffffff-no-rj`
			},
			"fields": []
		}
		var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
		var numMix = Math.floor(Math.random() * colorMix.length);
		gunEmbed.fields.push({
			name: `**Munição**`,
			value: `${item.ammo}/${item.maxAmmo}`,
		});
		gunEmbed.fields.push({
			name: `**Dano**`,
			value: `D${item.dmg}`,
		});
		return gunEmbed;
	}
	if(type == 'melle'){
		const melleEmbed = {
			"title":`『 ${item.name.substr(0,1).toUpperCase()+item.name.substr(1,item.name.length)} 』`,
			"color":[0, 255, 0],
			"image":{
				"url": `https://i.redd.it/vccnsf5veuv51.jpg`
			},
			"fields": []
		}
		var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
		var numMix = Math.floor(Math.random() * colorMix.length);
		melleEmbed.fields.push({
			name: `**Dano**`,
			value: `D${item.dmg}`,
		});
		return melleEmbed;
	}
	if(type == 'coin'){
		if(player.inventory.coin == "")
			player.inventory.coin = item.val;
		return embedStatus(interaction, player);
	}
	if(type == 'bag'){
		const bagEmbed = {
			"title":`『 ${item.name.substr(0,1).toUpperCase()+item.name.substr(1,item.name.length)} 』`,
			"color":[0, 255, 0],
			"image":{
				"url": `https://extra.globo.com/incoming/21313426-9db-6f2/w480h720-PROP/mochilas-jequie-4.jpg`
			},
			"description":`**Descrição**\n${item.description}`
		}
		var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
		var numMix = Math.floor(Math.random() * colorMix.length);
		return bagEmbed;
	}
}