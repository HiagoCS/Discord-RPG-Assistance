module.exports = (interaction, gun) =>{
	const gunEmbed = {
		"title":`『 ${gun.name.substr(0,1).toUpperCase()+gun.name.substr(1,gun.name.length)} 』`,
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
		value: `${gun.ammo}/${gun.maxAmmo}`,
	});
	gunEmbed.fields.push({
		name: `**Dano**`,
		value: `D${gun.dmg}`,
	});
	return gunEmbed;
}