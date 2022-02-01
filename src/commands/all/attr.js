//APIS
const fs = require('fs');
//=====================================================================

//Discord events
const Command = require('../../structures/Command');

//Functions
const embedAttr = require('../../modulesExports/functions/embedAttr.js');
const registerPlayer = require('../../modulesExports/functions/registerPlayer.js');
//===================================================================================

//Embeds
var messageEmbeds = require('../../../JSON/embeds/messages.json');
const listsEmbeds = require('../../../JSON/embeds/list.json');
//===========================================================================
const botconfig = require('../../../JSON/botconfig.json');

module.exports = class extends Command{
	constructor(client){
		super(client, {
			name: 'attr',
			description: "Modifica ou exibe os atributos de um personagem.", 
			options: [
				{
					name: 'personagem',
					type: 'STRING',
					description:'Nome do personagem.'
				},
				{
					name: 'atributo',
					type: 'STRING',
					description: 'Nome do atributo.' 
				},
				{
					name: 'valor',
					type: 'STRING',
					description: 'Novo valor do atributo.' 
				}
			]
		});
	}
	run = (interaction) =>{
		const role = interaction.guild.roles.cache.find(r => r.name === botconfig.rpgadm).id;
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
								checkingAtributtes(interaction, player);
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
					checkingAtributtes(interaction, player);
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
					checkingAtributtes(interaction, player);
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
					if(player.id == interaction.user.id){
						checkingAtributtes(interaction, player);
					}
					else{
						interaction.channel.send({embeds: [messageEmbeds.noRole]})
							.then(() =>{
								setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
							});
					}
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
	}
}
function checkingAtributtes(interaction, player){
	if(interaction.options.getString("atributo") && interaction.options.getString("valor")){
		var index = null;
		for(let i in player.attr){
			if(player.attr[i].name == interaction.options.getString("atributo").toLowerCase()+" ")
				index = i;
		}
		if(index){
			console.log("=== ATTR ANTIGO ===");
			console.log(player.attr[index]);
			player.attr[index].value = interaction.options.getString("valor");
			player.attr[index].maxValue = interaction.options.getString("valor");
			console.log("=== ATTR NOVO ===");
			console.log(player.attr[index]);
			var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
			var numMix = Math.floor(Math.random() * colorMix.length);
			messageEmbeds.showAttr.thumbnail.url = player.image;
			messageEmbeds.showAttr.fields = {
				name: `__**${player.attr[index].name.substr(0, 1).toUpperCase()+player.attr[index].name.substr(1, player.attr[index].name.length)}**__`,
				value: colorMix[numMix]+player.attr[index].maxValue+'\n```',
			}
			const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
			pChannel.send({embeds: [messageEmbeds.showAttr]});
			registerPlayer(interaction, player);
			return;
		}
		else{
			messageEmbeds.alert.description = `Não existe atributo com esse nome!`;
			const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
			pChannel.send({embeds: [messageEmbeds.alert]})
				.then(() =>{
					setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
				});
		}
	}
	if(!interaction.options.getString("atributo") && !interaction.options.getString("valor")){
		const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
		pChannel.send({embeds: embedAttr(interaction, player)});
	}
	if(interaction.options.getString("atributo") && !interaction.options.getString("valor")){
		var index = null;
		for(let i in player.attr){
			if(player.attr[i].name == interaction.options.getString("atributo").toLowerCase()+" ")
				index = i;
		}
		if(index){
			const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
			pChannel.send({embeds: [testAtributte(interaction, player.attr[index])]});
		}
		else{
			messageEmbeds.alert.description = `Não existe atributo com esse nome!`;
			const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
			pChannel.send({embeds: [messageEmbeds.alert]})
				.then(() =>{
					setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
				});
		}
	}
	if(!interaction.options.getString("atributo") && interaction.options.getString("valor")){
		for(let i in player.attr){
			listsEmbeds.sa.fields[i] = {
				name: `${parseInt(i)+1}: __**${player.attr[i].name.substr(0, 1).toUpperCase()+player.attr[i].name.substr(1, player.attr[i].name.length)}**__`,
				value: player.attr[i].maxValue
			}
		}
		const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
		pChannel.send({embeds: [listsEmbeds.sa], content: `Digite o número do atributo:`})
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
						console.log("=== ATTR ANTIGO ===");
						console.log(player.attr[index]);
						player.attr[index].value = interaction.options.getString("valor");
						player.attr[index].maxValue = interaction.options.getString("valor");
						console.log("=== ATTR NOVO ===");
						console.log(player.attr[index]);
						var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
						var numMix = Math.floor(Math.random() * colorMix.length);
						messageEmbeds.showAttr.thumbnail.url = player.image;
						messageEmbeds.showAttr.fields = {
							name: `__**${player.attr[index].name.substr(0, 1).toUpperCase()+player.attr[index].name.substr(1, player.attr[index].name.length)}**__`,
							value: colorMix[numMix]+player.attr[index].maxValue+'\n```',
						}
						const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
						pChannel.send({embeds: [messageEmbeds.showAttr]});
						registerPlayer(interaction, player);
						return;
					}).catch((err) =>{
						console.log(err);
					});
			}).catch((err) =>{
				console.log(err);
			});
	}

}
function testAtributte(interaction, attr){
	const level = parseInt(attr.maxValue);
	const dice = Math.floor(Math.random() * 20 + 1);
	var test =[
		[20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1],
		[null,20,20,19,19,18,18,17,17,16,16,15,15,14,14,13,13,12,12,11],
		[null,null,null,null,20,20,20,20,20,19,19,19,19,19,18,18,18,18,18,17]
	];
	if(dice >= test[0][level-1] && dice < test[1][level-1]){
		const successType = {
			title: "💚 Normal 💚",
			color:[0, 255, 0],
			description: `Dado caiu ${dice}, ${attr.name} de valor ${level}`
		}
		return successType;
	}
	else if(dice >= test[1][level-1] && dice < test[2][level-1]){
		const successType = {
			title: "💎 Bom 💎",
			color:[0, 0, 255],
			description: `Dado caiu ${dice}, ${attr.name} de valor ${level}`
		}
		return successType;
	}
	else if(dice >= test[2][level-1]){
		const successType = {
			title: "🔥 EXTREMO 🔥",
			color:[255, 0, 0],
			description: `Dado caiu ${dice}, ${attr.name} de valor ${level}`
		}
		return successType;
	}
	else{
		const successType = {
			title: "🚫 Falhou 🚫",
			color:[255, 255, 0],
			description: `Dado caiu ${dice}, ${attr.name} de valor ${level}`
		}
		return successType;
	}
}