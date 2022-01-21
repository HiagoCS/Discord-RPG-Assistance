//Functions
const embedStatus = require('../../modulesExports/functions/embedStatus.js');
const registerPlayer = require('../../modulesExports/functions/registerPlayer.js');
//===================================================================================

//Embeds
const player_card = require('../../../JSON/embeds/player_card.json');
const listsEmbeds = require('../../../JSON/embeds/list.json');
//===========================================================================
module.exports = (interaction, player) =>{
	if(interaction.options.getString('status').toLowerCase() == 'list'){
		for(let i in player.status){
			listsEmbeds.ss.fields[i] = {
				name: player.status[i].name.substr(0, 1).toUpperCase()+player.status[i].name.substr(1, player.status[i].name.length),
				value:`${ player.status[i].value}/${ player.status[i].maxValue}`
			}
		}
		interaction.channel.send({embeds: [listsEmbeds.ss], content:`Digite o nome do status:`})
			.then(() =>{
				const filter = b => b.author.id === interaction.user.id;
				interaction.channel.awaitMessages({filter, max:1})
					.then((collected) =>{
						const collect = collected.first().content.toLowerCase();
						console.log(collect);
						changeValue(interaction, collect, player);
					}).catch((err) =>{
						return interaction.channel.send({content:"Este status não existe, use novamente o comando com um status existente"});
					});
			}).catch((err) =>{
				console.log(err)
			});
	}
	else{
		changeValue(interaction, interaction.options.getString('status'), player);
	}
}
function changeValue(interaction, status, player){
	console.log("=====STATUS ANTIGO=====");
	console.log(player);
	for(let i in player.status){
		if(player.status[i].name == status){
			const result = parseInt(player.status[i].value)+parseInt(interaction.options.getString('valor'));
			if(result > player.status[i].maxValue)
				player.status[i].value = player.status[i].maxValue;
			else if(result < 0)
				player.status[i].value = 0;
			else
				player.status[i].value = result;
			break;
		}
	}
	console.log("=====STATUS NOVO=====");
	console.log(player);
	player_card.status = embedStatus(interaction, player);
	interaction.channel.send({embeds: [player_card.status]});
	registerPlayer(interaction, player);
}