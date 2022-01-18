const fs = require('fs');

module.exports = (interaction, player) =>{
	console.log("Register player ON!!");
	var json = JSON.stringify(player);
	fs.writeFile(`JSON/fichas/${player.name.toLowerCase()}.json`, json, {encoding: "utf8"}, (err) =>{
		if (err)console.log(err);
		else{
			interaction.channel.send({content:`${player.name} criado com sucesso!!`});
		}
	});
}