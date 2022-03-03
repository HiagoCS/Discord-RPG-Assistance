const {MessageActionRow, MessageButton} = require('discord.js');
const {pagination} = require('reconlx');
const fs = require('fs');
const {join} = require('path');
const Command = require('../../structures/Command');
//Embeds
const listsEmbeds = require('../../../JSON/embeds/list.json');
const msgEmbeds = require('../../../JSON/embeds/messages.json');
const embedStatus = require('../../modulesExports/functions/embedStatus.js');
const embedAttr = require('../../modulesExports/functions/embedAttr.js');
const embedSkill = require('../../modulesExports/functions/embedSkill.js');
const showPagination = require('../../modulesExports/functions/pagination.js');
const registerPlayer = require('../../modulesExports/functions/registerPlayer.js')
//-----------------------------------
//Globals Variables
var globalId = 0;
var globalVal = "";
let player;
const optionBase = ['status', 'attr', 'skills', 'final'];
const format = [
		{'name': 'Status', 'color': [0, 0, 255]},
		{'name': 'Atributos', 'color': [0, 255, 0]},
		{'name': 'Pericias', 'color': [255, 0, 0]}
]
let localplayer = {
	"id":[],
	"username":[]
};
const botconfig = require('../../../JSON/botconfig.json');
//---------------------------
//Buttons
const selectEmbeds = require('../../modulesExports/buttons/selectEmbeds.js');
const Save_Edit_Delete = require(`../../modulesExports/buttons/save_edit_delete.js`);
const YesNo = require(`../../modulesExports/buttons/yesno.js`);
//-------------
module.exports = class extends Command {
	constructor(client){
		super(client, {
			name: 'edit',
			description: 'Auxilia a edição de um dos personagens.',
			options: [
				{
					name:'nickname',
					type:'STRING',
					description:'Nome do personagem para exibir.'
				}
			]
		})

	}

	run = (interaction) =>{
		const role = interaction.guild.roles.cache.find(r => r.name === botconfig.rpgadm).id;
		if(interaction.member._roles.includes(role)){
			if(interaction.options.getString('nickname')){
				try{
					player = require(`../../../JSON/fichas/${interaction.options.getString('nickname').toLowerCase()}.json`);
				}
				catch{
					msgEmbeds.error.description = `Este personagem não existe, use novamente o comando com um personagem existente`;
					return interaction.channel.send({embeds: [msgEmbeds.error]})
						.then(() =>{
							setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 8000);
						});
				}
				msgEmbeds.msg.title = `Editar quais pontos?`;
				msgEmbeds.msg.description = `Escolha o que você ira editar do personagem ${player.name.substr(0, 1).toUpperCase()+player.name.substr(1, player.name.length)}`;
				msgEmbeds.msg.color = [255,255,255];
				const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
				pChannel.send({embeds:[msgEmbeds.msg], components:[selectEmbeds], ephemeral: true})
					.then((msg) =>{
						const filter = b => b.user.id === interaction.user.id;
						pChannel.awaitMessageComponent({filter, max:1})
							.then((collected) =>{
								msg.delete();
								if(collected.customId == optionBase[0]){
									msgEmbeds.msg.title = format[0].name;
									msgEmbeds.msg.color = format[0].color;
									edit(interaction, collected.customId, player.status);
								}
								else if(collected.customId == optionBase[1]){
									msgEmbeds.msg.title = format[1].name;
									msgEmbeds.msg.color = format[1].color;
									edit(interaction, collected.customId, player.attr);
								}
								else if(collected.customId == optionBase[2]){
									msgEmbeds.msg.title = format[2].name;
									msgEmbeds.msg.color = format[2].color;
									edit(interaction, collected.customId, player.skills);
								}
							}).catch((err) =>{
								console.log(err);
							});
					}).catch((err) =>{
						console.log(err)
					});
			}
			else{
				let files = fs.readdirSync("./JSON/fichas"); const list = []; files.shift();
				for(let i in files){
					const idBrute = require(`../../../JSON/fichas/${files[i]}`);
					localplayer.id.push(idBrute.id);
					const username = interaction.channel.guild.members.cache.find(r => r.id === localplayer.id[i]).user.username;
					localplayer.username.push(username);
					list[i] = files[i].split('.json');
					const playerName = list[i][0].substr(0, 1).toUpperCase()+list[i][0].substr(1, list[i][0].length);
					listsEmbeds.sp.fields[i] = {
						name: playerName,
						value: username
					}
				}
				interaction.channel.send({embeds: [listsEmbeds.sp], content:`Digite o nome do personagem:`})
					.then((msg) =>{
						const filter = b => b.author.id === interaction.user.id;
						interaction.channel.awaitMessages({filter, max:1})
						.then((collected) =>{
							msg.delete();
							if(collected.first().content.toLowerCase() == 'cancel'){
								return interaction.channel.send({content:'Edição cancelada'})
									.then(() =>{
										setTimeout(() => interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.bot === true).delete(), 5000);
									});
							}
							player = require(`../../../JSON/fichas/${collected.first().content.toLowerCase()}.json`);
							interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
							msgEmbeds.msg.title = `Editar quais pontos?`;
							msgEmbeds.msg.description = `Escolha o que você ira editar do personagem ${player.name.substr(0, 1).toUpperCase()+player.name.substr(1, player.name.length)}`;
							msgEmbeds.msg.color = [255,255,255];
							const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
							pChannel.send({embeds:[msgEmbeds.msg], components:[selectEmbeds], ephemeral: true})
								.then((msg) =>{
									const filter = b => b.user.id === interaction.user.id;
									pChannel.awaitMessageComponent({filter, max:1})
										.then((collected) =>{
											msg.delete();
											if(collected.customId == optionBase[0]){
												msgEmbeds.msg.title = format[0].name;
												msgEmbeds.msg.color = format[0].color;
												edit(interaction, collected.customId, player.status);
											}
											else if(collected.customId == optionBase[1]){
												msgEmbeds.msg.title = format[1].name;
												msgEmbeds.msg.color = format[1].color;
												edit(interaction, collected.customId, player.attr);
											}
											else if(collected.customId == optionBase[2]){
												msgEmbeds.msg.title = format[2].name;
												msgEmbeds.msg.color = format[2].color;
												edit(interaction, collected.customId, player.skills);
											}
										}).catch((err) =>{
											console.log(err);
										});
								}).catch((err) =>{
									console.log(err);
								});
						}).catch((err) =>{
							msgEmbeds.error.description = `Este personagem não existe, use novamente o comando com um personagem existente`;
							interaction.channel.messages.cache.find(b => b.author.id === interaction.user.id).delete();
							return interaction.channel.send({embeds: [msgEmbeds.error]})
								.then(() =>{
									setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 8000);
								});
						});
					}).catch((err) =>{
						console.log(err);
					});
			}
		}
		else{
			let filesList = fs.readdirSync("./JSON/fichas"); filesList.shift();
			for(let i in filesList){
				const file = require(`../../../JSON/fichas/${filesList[i]}`);
				if(file.id == interaction.user.id){
					player = file;
				}
			}
			if(player){
				if(interaction.options.getString('nickname') != null){
					if(interaction.options.getString('nickname').toLowerCase() != player.name.toLowerCase()){
						interaction.channel.send({embeds: [msgEmbeds.noRole], ephemeral: true})
							.then(() =>{
								setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 8000);
							});
					}
				}
				else{
					msgEmbeds.msg.title = `Editar quais pontos?`;
					msgEmbeds.msg.description = `Escolha o que você ira editar do personagem ${player.name.substr(0, 1).toUpperCase()+player.name.substr(1, player.name.length)}`;
					msgEmbeds.msg.color = [255,255,255];
					const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
					pChannel.send({embeds:[msgEmbeds.msg], components:[selectEmbeds], ephemeral: true})
						.then((msg) =>{
							const filter = b => b.user.id === interaction.user.id;
							pChannel.awaitMessageComponent({filter, max:1})
								.then((collected) =>{
									msg.delete();
									if(collected.customId == optionBase[0]){
										msgEmbeds.msg.title = format[0].name;
										msgEmbeds.msg.color = format[0].color;
										edit(interaction, collected.customId, player.status);
									}
									else if(collected.customId == optionBase[1]){
										msgEmbeds.msg.title = format[1].name;
										msgEmbeds.msg.color = format[1].color;
										edit(interaction, collected.customId, player.attr);
									}
									else if(collected.customId == optionBase[2]){
										msgEmbeds.msg.title = format[2].name;
										msgEmbeds.msg.color = format[2].color;
										edit(interaction, collected.customId, player.skills);
									}
								}).catch((err) =>{
									console.log(err);
								});
						}).catch((err) =>{
							console.log(err)
						});
				}
			}
			else{
				msgEmbeds.alert.description = `Sem personagem para editar`;
				return interaction.channel.send({embeds:[msgEmbeds.alert]})
					.then(() =>{
						setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
					});
			}
		}
	}
}

//======EDIT FUNCTION=========//
function edit(interaction, option, object){
	let editEmbed = {
		title: msgEmbeds.msg.title,
		fields: [],
		color: msgEmbeds.msg.color
	}
	for(let i in object){
		editEmbed.fields[i] = {
			name: `__**${parseInt(i)+1}: ${object[i].name.substr(0, 1).toUpperCase()+object[i].name.substr(1, object[i].name.length)}**__`,
			value: object[i].maxValue
		}
	}
	const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
	pChannel.send({embeds: [editEmbed], content:`Digite o número do item a editar:`, ephemeral:true})
		.then((msg) =>{
			const filter = b => b.author.id === interaction.user.id;
			pChannel.awaitMessages({filter, max:1})
				.then((collectId) =>{
					msg.delete();
					if(collectId.first().content.toLowerCase() == 'cancel'){
						return interaction.channel.send({content:'Edição cancelada'})
							.then(() =>{
								setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
							});
					}
					const id = parseInt(collectId.first().content) - 1;
					interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
					globalId = id;
					try{
							editEmbed = {
							title: msgEmbeds.msg.title,
							fields: [
								{
									name: `__**Nome: ${object[id].name.substr(0, 1).toUpperCase()+object[id].name.substr(1, object[id].name.length)}**__`,
									value: `Valor: ${object[id].maxValue}`
								}
							],
							color: msgEmbeds.msg.color
							}
					}
					catch{
						msgEmbeds.error.description = `Elemento não está na lista!`;
						return pChannel.send({embeds: [msgEmbeds.error]}).then(() =>{
							setTimeout(() => pChannel.messages.cache.find(b => b.author.bot === true).delete(), 8000);
						});
					}
					pChannel.send({embeds: [editEmbed], content:`Digite "NovoNome NovoValor"`, ephemeral: true})
						.then((msg) =>{
							const filter = b => b.author.id === interaction.user.id;
							pChannel.awaitMessages({filter, max:1})
								.then((collectChange) =>{
									msg.delete();
									if(collectChange.first().content.toLowerCase() == 'cancel'){
										return pChannel.send({content:'Edição cancelada'})
											.then(() =>{
												setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
											});
									}
									const change = collectChange.first().content.split(/(\d)/);
									interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
									var globalVal = "";
									for(let i in change){
										if(!isNaN(change[i])){
											globalVal += change[i];
										}
									}
									console.log("========\nANTIGO "+msgEmbeds.msg.title.toUpperCase());
									for(let i in object){
										console.log(object[i]);
									}
									object.splice(globalId, 1);
									object.push({
										"id":globalId,
										"name":change[0].toLowerCase(),
										"value":globalVal,
										"maxValue":globalVal
									});
									console.log(`${change[0]} adicionado`);
									console.log("========\nNOVO "+msgEmbeds.msg.title.toUpperCase());
									for(let i in object){
										console.log(object[i]);
									}
									if(option == optionBase[0]){
										const player_card = embedStatus(interaction, player);
										saveDelete(interaction, player_card, option);
									}
									else if(option == optionBase[1]){
										const player_card = embedAttr(interaction, player);
										saveDelete(interaction, player_card, option);
									}
									else if(option == optionBase[2]){
										const player_card = embedSkill(interaction, player);
										saveDelete(interaction, player_card, option);
									}
								}).catch((err) =>{
									console.log(err);
								});
						});
				}).catch((err) =>{
					msgEmbeds.error.description = `Este item não existe, use novamente o comando com um personagem existente`;
					return interaction.channel.send({embeds: [msgEmbeds.error]})
						.then(() =>{
							setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 8000);
						});
				});	
		}).catch((err) =>{ 
			console.log(err)
		});
}

//=========SAVE/DELETE FUNCTION=========
function saveDelete(interaction, embed, option){
	const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
	pChannel.send({embeds: embed, components:[Save_Edit_Delete], ephemeral: true})
	.then((msg) =>{
		const filter = b => b.user.id === interaction.user.id;
		pChannel.awaitMessageComponent({filter, max:1})
		.then((collected) =>{
			msg.delete();
			if(collected.customId == 'save'){
				showPagination(interaction, embedStatus(interaction, player), embedAttr(interaction, player), embedSkill(interaction, player), player);
				registerPlayer(interaction, player);	
			}
			else if(collected.customId == 'del'){
				pChannel.send({content:`Reiniciando edição de ${msgEmbeds.msg.title}`, ephemeral: true})
					.then(() =>{
							setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
					});
					if(option == optionBase[0]){
						player.status = [];
					}
					else if(option == optionBase[1]){
						player.attr = [];
					}
					else{
						player.skills = [];
					}
				addId = 0;
				addMethod(interaction, option);
			}
			else if(collected.customId == 'edit'){
				if(option == optionBase[0])
					edit(interaction, option, player.status, embed);
				else if(option == optionBase[1])
					edit(interaction, option, player.attr, embed);
				else if(option == optionBase[2])
					edit(interaction, option, player.skills, embed);
			}
		}).catch((err) =>{
			console.log(err);
		});
	}).catch((err) =>{
		console.log(err);
	});
}

function addMethod(interaction, option){
	if(option == optionBase[0]){
		msgEmbeds.msg.title = format[0].name;
		msgEmbeds.msg.description = `Defina um ${format[0].name.toLowerCase()} para o personagem e o valor maximo`;
		msgEmbeds.msg.color = format[0].color;
	}
	else if(option == optionBase[1]){
		msgEmbeds.msg.title = format[1].name;
		msgEmbeds.msg.description = `Defina um ${format[1].name.toLowerCase().substr(0, format[1].length-1)} para o personagem e o valor maximo`;
		msgEmbeds.msg.color = format[1].color;
	}
	else if(option == optionBase[2]){
		msgEmbeds.msg.title = format[2].name;
		msgEmbeds.msg.description = `Defina uma ${format[2].name.toLowerCase().substr(0, format[2].length-1)} para o personagem e o valor maximo`;
		msgEmbeds.msg.color = format[2].color;
	}
	const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
	pChannel.send({embeds:[msgEmbeds.msg], ephemeral: true})
	.then((msg) =>{
		const filter = b => b.author.id === interaction.user.id;
		pChannel.awaitMessages({filter, max:1})
		.then((collected) =>{
			msg.delete();
			if(collected.first().content.toLowerCase() == 'cancel'){
				return pChannel.send({content:'Edição cancelada'})
					.then(() =>{
						setTimeout(() => pChannel.messages.cache.first().delete(), 5000);
					});
			}
			var collect = collected.first().content.split(/(\d)/);
			interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
			for(let i in collect){
				if(!isNaN(collect[i])){
					globalVal += collect[i];
				}
			}
			if(option == optionBase[0]){
				player.status[addId] = {
					'id':addId,
					'name':collect[0].toLowerCase(), 
					'value':globalVal,
					'maxValue':globalVal
				}
				console.log("========\nSTATUS");
				for(let i in player.status){
					console.log(player.status[i]);
				}
			}
			else if(option == optionBase[1]){
				player.attr[addId] = {
					'id':addId,
					'name':collect[0].toLowerCase(), 
					'value':globalVal,
					'maxValue':globalVal
				}
				console.log("===========\nATRIBUTOS");
				for(let i in player.attr){
					console.log(player.attr[i]);
				}
			}
			else if(option == optionBase[2]){
				player.skills[addId] = {
					'id':addId,
					'name':collect[0].toLowerCase(), 
					'value':globalVal,
					'maxValue':globalVal
				}
				console.log("===========\nPERICIAS");
				for(let i in player.skills){
					console.log(player.skills[i]);
				}
			}

			pChannel.send({content:`Adicionar mais ${msgEmbeds.msg.title.toLowerCase()}?`, ephemeral:true, components:[YesNo]})
			.then((msg) =>{
				const filter = b => b.user.id === interaction.user.id;
				pChannel.awaitMessageComponent({filter, max:1})
				.then((collected) =>{
					msg.delete();
					if(collected.customId == 'yes'){
						addMethod(interaction, option);
						addId++;
					}
					else if(collected.customId == 'no' && option == optionBase[0]){
						const player_card = embedStatus(interaction, player);
						saveDelete(interaction, player_card, option);
					}
					else if(collected.customId == 'no' && option == optionBase[1]){
						const player_card = embedAttr(interaction, player);
						saveDelete(interaction, player_card, option);
					}
					else if(collected.customId == 'no' && option == optionBase[2]){
						const player_card = embedSkill(interaction, player);
						saveDelete(interaction, player_card, option);
					}
					else
						return;
				})
			})

		});
	});
}