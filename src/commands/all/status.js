//APIS
const fs = require('fs');
//=====================================================================

//Discord events
const Command = require('../../structures/Command');

//Functions
const embedStatus = require('../../modulesExports/functions/embedStatus.js');
const registerPlayer = require('../../modulesExports/functions/registerPlayer.js');
const playerMethod = require('../../modulesExports/functions/playerMethod.js');
//===================================================================================

//Embeds
var messageEmbeds = require('../../../JSON/embeds/messages.json');
const listsEmbeds = require('../../../JSON/embeds/list.json');
//===========================================================================
module.exports = class extends Command{
	constructor(client){
		super(client, {
			name: 'status',
			description: 'Modifica ou exibe os status de um personagem.',
			options:[
				{
					name: 'personagem',
					type: 'STRING',
					description:'Nome do personagem que será criado'
				},
				{
					name: 'status',
					type: 'STRING',
					description: 'Nome do status a alterar.' 
				},
				{
					name: 'valor',
					type: 'STRING',
					description:'Valor a ser aplicado no status'
				}
			]
		});
	}

	run = (interaction) =>{
		const role = interaction.guild.roles.cache.find(r => r.name === 'Cesár').id;
		//APENAS ADM
		if(interaction.member._roles.includes(role)){
			if(!interaction.options.getString("personagem")){
				const filesList = fs.readdirSync("./JSON/fichas");filesList.shift();
				for(let i in filesList){
					const file = require(`../../../JSON/fichas/${filesList[i]}`);
					listsEmbeds.sp.fields[i] = {
						name: file.name.substr(0, 1).toUpperCase()+file.name.substr(1, file.name.length),
						value: interaction.channel.guild.members.cache.find(r => r.id === file.id).user.username
					}
				}
				interaction.channel.send({embeds: [listsEmbeds.sp], content:`Digite o nome do personagem:`})
					.then((msg) =>{
						const filter = b => b.author.id === interaction.user.id;
						interaction.channel.awaitMessages({filter, max:1})
							.then((collected) =>{
								msg.delete();
								const collect = collected.first().content.toLowerCase();
								if(collect == 'cancel'){
									return interaction.channel.send({content:'Exibição cancelada'})
										.then(() =>{
											setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
											interaction.channel.messages.cache.find(b => b.author.id === interaction.user.id).delete();
										});
								}
								const player = require(`../../../JSON/fichas/${collect}.json`);
								interaction.channel.messages.cache.find(b => b.author.id === interaction.user.id).delete();
								checkingStatus(interaction, player);
							}).catch((err) =>{
								console.log(err);
								messageEmbeds.error.description = "Este personagem não está na lista!";
								return interaction.channel.send({embeds: [messageEmbeds.error]})
									.then(() =>{
											setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
											interaction.channel.messages.cache.find(b => b.author.id === interaction.user.id).delete();
										});
							});
					}).catch((err) =>{
						console.log(err);
					});
			}
			else{
				var player = null;
				try{
					player = require(`../../../JSON/fichas/${interaction.options.getString("personagem").toLowerCase()}.json`);
					checkingStatus(interaction, player);
				}
				catch{
					messageEmbeds.error.description = `Este personagem não existe!`;
					interaction.channel.send({embeds: [messageEmbeds.error]})
						.then(() =>{
							setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
						});
				}
			}
		}

		//APENAS JOGADORES
		else{
			if(!interaction.options.getString("personagem")){
				const filesList = fs.readdirSync("./JSON/fichas");filesList.shift();
				var player = null;
				for(let i in filesList){
					const file = require(`../../../JSON/fichas/${filesList[i]}`);
					if(file.id == interaction.user.id){
						player = file;
					}
				}
				if(player){
					checkingStatus(interaction, player);
				}
				else{
					messageEmbeds.alert.description = `Sem personagem para exibir!`
					interaction.channel.send({embeds: [messageEmbeds.alert]})
						.then(() =>{
							setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
						});
				}
			}
			else{
				var player = null;
				try{
					player = require(`../../../JSON/fichas/${interaction.options.getString("personagem").toLowerCase()}.json`);
				}
				catch{
					messageEmbeds.error.description = `Este personagem não existe!`;
					interaction.channel.send({embeds: [messageEmbeds.error]})
						.then(() =>{
							setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
						});
				}
				if(player.id == interaction.user.id){
					checkingStatus(interaction, player);
				}
				else{
					interaction.channel.send({embeds: [messageEmbeds.noRole]})
						.then(() =>{
							setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
						});
				}
			}
		}
	}
}
function calculateStatus(interaction, player, index, damage){
	console.log("=== STATUS ANTIGO ===");
	console.log(player.status[index]);
	var value = parseInt(player.status[index].value);
	var maxValue = parseInt(player.status[index].maxValue);
	var damage = parseInt(damage);
	const result = value + damage;
	console.log(result);
	if(result <= 0){
		player.status[index].value = '0';
	}
	else if(result >= maxValue){
		player.status[index].value = player.status[index].maxValue;
	}
	else{
		player.status[index].value = result.toString();
	}

	var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
	var numMix = Math.floor(Math.random() * colorMix.length);
	messageEmbeds.showStatus.author.name = `『📝 ${player.name.substr(0,1).toUpperCase()+player.name.substr(1, player.name.length)} 📝』`;
	messageEmbeds.showStatus.image.url = player.image;
	messageEmbeds.showStatus.fields = {
		name: `__**${player.status[index].name.substr(0, 1).toUpperCase()+player.status[index].name.substr(1, player.status[index].name.length)}**__`,
		value:colorMix[numMix]+player.status[index].value+'/'+player.status[index].maxValue+'\n```'
	}
	const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
	pChannel.send({embeds: [messageEmbeds.showStatus]});
	console.log("=== STATUS NOVO ===");
	console.log(player.status[index]);
	registerPlayer(interaction, player);
	return;
}
function checkingStatus(interaction, player){
	if(interaction.options.getString("status") && interaction.options.getString("valor")){
		var index = null;
		for(let i in player.status){
			if(player.status[i].name == interaction.options.getString("status").toLowerCase()+" ")
				index = i;
		}
		if(index){
			calculateStatus(interaction, player, index, interaction.options.getString("valor"));
		}
		else{
			messageEmbeds.alert.description = `Não existe Status com esse nome!`;
			const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
			pChannel.send({embeds: [messageEmbeds.alert]})
				.then(() =>{
					setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
				});
		}
	}
	if(!interaction.options.getString("status") && !interaction.options.getString("valor")){
		const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
		pChannel.send({embeds: embedStatus(interaction, player)});
	}
	if(interaction.options.getString("status") && !interaction.options.getString("valor")){
		var index = null;
		for(let i in player.status){
			if(player.status[i].name == interaction.options.getString("status").toLowerCase()+" ")
				index = i;
		}
		if(index){
			var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
			var numMix = Math.floor(Math.random() * colorMix.length);

			messageEmbeds.showStatus.author.name = `『📝 ${player.name.substr(0,1).toUpperCase()+player.name.substr(1, player.name.length)} 📝』`;
			messageEmbeds.showStatus.image.url = player.image;
			messageEmbeds.showStatus.fields = {
				name: `__**${player.status[index].name.substr(0, 1).toUpperCase()+player.status[index].name.substr(1, player.status[index].name.length)}**__`,
				value: colorMix[numMix]+player.status[index].value+'/'+player.status[index].maxValue+'\n```'
			}
			const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
			pChannel.send({embeds: [messageEmbeds.showStatus]});
		}
		else{
			messageEmbeds.alert.description = `Não existe Status com esse nome!`;
			const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
			pChannel.send({embeds: [messageEmbeds.alert]})
				.then(() =>{
					setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
				});
		}					
	}
	if(!interaction.options.getString("status") && interaction.options.getString("valor")){
		for(let i in player.status){
			listsEmbeds.ss.fields[i] = {
				name: `${parseInt(i)+1}: __**${player.status[i].name.substr(0, 1).toUpperCase()+player.status[i].name.substr(1, player.status[i].name.length)}**__`,
				value: `${player.status[i].value}/**${player.status[i].maxValue}**`
			}
		}
		const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
		pChannel.send({embeds: [listsEmbeds.ss], content: `Digite o número do status:`})
			.then((msg) =>{
				const filter = b => b.author.id === interaction.user.id;
				pChannel.awaitMessages({filter, max:1})
					.then((collect) =>{
						if(collect.first().content.toLowerCase() == 'cancel'){
							return interaction.channel.send({content:'Exibição cancelada'})
								.then(() =>{
									setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
									interaction.channel.messages.cache.find(b => b.author.id === interaction.user.id).delete();
								});
						}
						var index = parseInt(collect.first().content - 1);
						calculateStatus(interaction, player, index, interaction.options.getString("valor"));
					}).catch((err) =>{
						console.log(err);
					});
			}).catch((err) =>{
				console.log(err);
			});
	}
}