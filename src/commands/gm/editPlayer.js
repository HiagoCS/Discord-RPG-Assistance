const {MessageActionRow, MessageButton} = require('discord.js');
const {pagination} = require('reconlx');
const fs = require('fs');
const {join} = require('path');
const Command = require('../../structures/Command');
//Embeds
const player_card = require('../../../JSON/embeds/player_card.json');
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
		const role = {
			'id': '852373845351989289',
			'name': ''
		}
		role.name = interaction.guild.roles.cache.find(r => r.id === role.id).name;
		if(interaction.member._roles.includes(role.id)){
			if(interaction.options.getString('nickname')){
				player = require(`../../../JSON/fichas/${interaction.options.getString('nickname').toLowerCase()}.json`);
				msgEmbeds.msg.title = `Editar quais pontos?`;
				msgEmbeds.msg.description = `Escolha o que você ira editar do personagem ${player.name.substr(0, 1).toUpperCase()+player.name.substr(1, player.name.length)}`;
				msgEmbeds.msg.color = [255,255,255];
				interaction.channel.send({embeds:[msgEmbeds.msg], components:[selectEmbeds], ephemeral: true})
					.then((msg) =>{
						const filter = b => b.user.id === interaction.user.id;
						interaction.channel.awaitMessageComponent({filter, max:1})
							.then((collected) =>{
								msg.delete({timeout: 3000});
								if(collected.customId == optionBase[0]){
									edit(interaction, collected.customId, player.status);
									msgEmbeds.msg.title = format[0].name;
									msgEmbeds.msg.color = format[0].color;
								}
								else if(collected.customId == optionBase[1]){
									edit(interaction, collected.customId, player.attr);
									msgEmbeds.msg.title = format[1].name;
									msgEmbeds.msg.color = format[1].color;
								}
								else if(collected.customId == optionBase[2]){
									edit(interaction, collected.customId, player.skills);
									msgEmbeds.msg.title = format[2].name;
									msgEmbeds.msg.color = format[2].color;
								}
							}).catch((err) =>{
								console.log(err);
							});
					}).catch((err) =>{
						console.log(err)
					});
			}
			else{
				let files = fs.readdirSync("./JSON/fichas"); const list = [];
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
							msg.delete({timeout: 3000});
							player = require(`../../../JSON/fichas/${collected.first().content.toLowerCase()}.json`);
							msgEmbeds.msg.title = `Editar quais pontos?`;
							msgEmbeds.msg.description = `Escolha o que você ira editar do personagem ${player.name.substr(0, 1).toUpperCase()+player.name.substr(1, player.name.length)}`;
							msgEmbeds.msg.color = [255,255,255];
							interaction.channel.send({embeds:[msgEmbeds.msg], components:[selectEmbeds], ephemeral: true})
								.then((msg) =>{
									const filter = b => b.user.id === interaction.user.id;
									interaction.channel.awaitMessageComponent({filter, max:1})
										.then((collected) =>{
											msg.delete({timeout: 3000});
											if(collected.customId == optionBase[0]){
												edit(interaction, collected.customId, player.status);
												msgEmbeds.msg.title = format[0].name;
												msgEmbeds.msg.color = format[0].color;
											}
											else if(collected.customId == optionBase[1]){
												edit(interaction, collected.customId, player.attr);
												msgEmbeds.msg.title = format[1].name;
												msgEmbeds.msg.color = format[1].color;
											}
											else if(collected.customId == optionBase[2]){
												edit(interaction, collected.customId, player.skills);
												msgEmbeds.msg.title = format[2].name;
												msgEmbeds.msg.color = format[2].color;
											}
										}).catch((err) =>{
											console.log(err);
										});
								}).catch((err) =>{
									console.log(err);
								});
						}).catch((err) =>{
							console.log(err);
						});
					}).catch((err) =>{
						console.log(err);
					});
			}
		}
		else{
			let files = fs.readdirSync("./JSON/fichas");
			for(let i in files){
				const filesList = require(`../../../JSON/fichas/${files[i]}`);
				if(filesList.id == interaction.user.id){
					if(interaction.options.getString('nickname') != null){
						if(interaction.options.getString('nickname').toLowerCase() != filesList.name.toLowerCase()){
							messageEmbeds.msg.title = `🚫 PERMISSÃO NEGADA 🚫`;
							messageEmbeds.msg.description = `Você não tem permissão para mexer com o personagem ${interaction.options.getString('nickname').substr(0, 1).toUpperCase()+interaction.options.getString('nickname').substr(1, interaction.options.getString('nickname').length)}`
							messageEmbeds.msg.color = [255, 0, 0];
							interaction.channel.send({embeds: [messageEmbeds.msg], ephemeral: true});
						}
					}
					else{
						player = filesList;
						msgEmbeds.msg.title = `Editar quais pontos?`;
						msgEmbeds.msg.description = `Escolha o que você ira editar do personagem ${player.name.substr(0, 1).toUpperCase()+player.name.substr(1, player.name.length)}`;
						msgEmbeds.msg.color = [255,255,255];
						interaction.channel.send({embeds:[msgEmbeds.msg], components:[selectEmbeds], ephemeral: true})
							.then((msg) =>{
								const filter = b => b.user.id === interaction.user.id;
								interaction.channel.awaitMessageComponent({filter, max:1})
									.then((collected) =>{
										msg.delete({timeout: 3000});
										if(collected.customId == optionBase[0]){
											edit(interaction, collected.customId, player.status);
											msgEmbeds.msg.title = format[0].name;
											msgEmbeds.msg.color = format[0].color;
										}
										else if(collected.customId == optionBase[1]){
											edit(interaction, collected.customId, player.attr);
											msgEmbeds.msg.title = format[1].name;
											msgEmbeds.msg.color = format[1].color;
										}
										else if(collected.customId == optionBase[2]){
											edit(interaction, collected.customId, player.skills);
											msgEmbeds.msg.title = format[2].name;
											msgEmbeds.msg.color = format[2].color;
										}
									}).catch((err) =>{
										console.log(err);
									});
							}).catch((err) =>{
								console.log(err)
							});
					}
				}
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
			value: object[i].value+'/'+object[i].maxValue
		}
	}
	interaction.channel.send({embeds: [editEmbed], content:`Digite o número do item a editar:`, ephemeral:true})
		.then((msg) =>{
			const filter = b => b.author.id === interaction.user.id;
			interaction.channel.awaitMessages({filter, max:1})
				.then((collectId) =>{
					msg.delete({timeout: 3000});
					const id = parseInt(collectId.first().content) - 1;
					globalId = id;
					editEmbed = {
						fields: [
							{
								name: `__**Nome: ${object[i].name.substr(0, 1).toUpperCase()+object[i].name.substr(1, object[i].name.length)}**__`,
								value: `Valor: ${object[id].value}/${object[id].maxValue}`
							}
						]
					}
					interaction.channel.send({embeds: [editEmbed], content:`Digite "NovoNome NovoValor"`, ephemeral: true})
						.then((msg) =>{
							const filter = b => b.author.id === interaction.user.id;
							interaction.channel.awaitMessages({filter, max:1})
								.then((collectChange) =>{
									msg.delete({timeout: 3000});
									const change = collectChange.first().content.split(" ");
									console.log("========\nANTIGO "+msgEmbeds.msg.title.toUpperCase());
									for(let i in object){
										console.log(object[i]);
									}
									object.splice(globalId, 1);
									object.push({
										"id":globalId,
										"name":change[0].toLowerCase(),
										"value":change[1],
										"maxValue":change[1]
									});
									console.log(`${change[0]} adicionado`);
									console.log("========\nNOVO "+msgEmbeds.msg.title.toUpperCase());
									for(let i in object){
										console.log(object[i]);
									}
									if(option == optionBase[0]){
										player_card.status = embedStatus(interaction, player);
										saveDelete(interaction, player_card.status, option);
									}
									else if(option == optionBase[1]){
										player_card.attr = embedAttr(interaction, player);
										saveDelete(interaction, player_card.attr, option);
									}
									else if(option == optionBase[2]){
										player_card.skill = embedSkill(interaction, player);
										saveDelete(interaction, player_card.skill, option);
									}
								}).catch((err) =>{
									console.log(err);
								});
						});
				}).catch((err) =>{
					console.log(err);
				});	
		}).catch((err) =>{ console.log(err)});
}

//=========SAVE/DELETE FUNCTION=========
function saveDelete(interaction, embed, option){
	interaction.channel.send({embeds:[embed], components:[Save_Edit_Delete], ephemeral: true})
	.then((msg) =>{
		const filter = b => b.user.id === interaction.user.id;
		interaction.channel.awaitMessageComponent({filter, max:1})
		.then((collected) =>{
			msg.delete({timeout: 3000});
			if(collected.customId == 'save'){
				player_card.status = embedStatus(interaction, player);
				player_card.attr = embedAttr(interaction, player);
				player_card.skill = embedSkill(interaction, player);
				showPagination(interaction, player_card, player);
				registerPlayer(interaction, player);	
			}
			else if(collected.customId == 'del'){
				interaction.channel.send({content:`Reiniciando ${option} edit`, ephemeral: true});
				player.status = [];
				player_card.status.fields = [];
				addMethod(interaction, option);
				addId = 0;
			}
			else if(collected.customId == 'edit'){
				if(option == optionBase[0])
					edit(interaction, option, player.status, player_card.status);
				else if(option == optionBase[1])
					edit(interaction, option, player.attr, player_card.attr);
				else if(option == optionBase[2])
					edit(interaction, option, player.skills, player_card.skill);
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
	interaction.channel.send({embeds:[msgEmbeds.msg], ephemeral: true})
	.then((msg) =>{
		const filter = b => b.author.id === interaction.user.id;
		interaction.channel.awaitMessages({filter, max:1})
		.then((collected) =>{
			msg.delete({timeout: 3000});
			if(collected.first().content.toLowerCase() == 'cancel')
				return interaction.channel.send({content:'Ficha cancelada'});
			var collect = collected.first().content.split(" ");
			if(option == optionBase[0]){
				player.status[addId] = {
					'id':addId,
					'name':collect[0].toLowerCase(), 
					'value':collect[1],
					'maxValue':collect[1]
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
					'value':collect[1],
					'maxValue':collect[1]
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
					'value':collect[1],
					'maxValue':collect[1]
				}
				console.log("===========\nPERICIAS");
				for(let i in player.skills){
					console.log(player.skills[i]);
				}
			}

			interaction.channel.send({content:`Adicionar mais ${msgEmbeds.msg.title.toLowerCase()}?`, ephemeral:true, components:[YesNo]})
			.then((msg) =>{
				const filter = b => b.user.id === interaction.user.id;
				interaction.channel.awaitMessageComponent({filter, max:1})
				.then((collected) =>{
					msg.delete({timeout: 3000});
					if(collected.customId == 'yes'){
						addMethod(interaction, option);
						addId++;
					}
					else if(collected.customId == 'no' && option == optionBase[0]){
						player_card.status = embedStatus(interaction, player);
						saveDelete(interaction, player_card.status, option);
					}
					else if(collected.customId == 'no' && option == optionBase[1]){
						player_card.attr = embedAttr(interaction, player);
						saveDelete(interaction, player_card.attr, option);
					}
					else if(collected.customId == 'no' && option == optionBase[2]){
						player_card.skill = embedSkill(interaction, player);
						saveDelete(interaction, player_card.skill, option);
					}
					else
						return;
				})
			})

		});
	});
}