//APIS
const {MessageActionRow, MessageButton} = require('discord.js');
const {pagination} = require('reconlx');
const fs = require('fs');
//=====================================================================
//Discord events
const Command = require('../../structures/Command');
const client = require("../../structures/Client");
//=====================================================

//Functions
const embedStatus = require('../../modulesExports/functions/embedStatus.js');
const embedAttr = require('../../modulesExports/functions/embedAttr.js');
const embedSkill = require('../../modulesExports/functions/embedSkill.js');
const showPagination = require('../../modulesExports/functions/pagination.js');
const registerPlayer = require('../../modulesExports/functions/registerPlayer.js');
//===================================================================================

//Buttons
const YesNo = require('../../modulesExports/buttons/yesno.js');
const selectEmbeds = require('../../modulesExports/buttons/selectEmbeds.js');
const Save_Edit_Delete = require('../../modulesExports/buttons/save_edit_delete.js');
//======================================================================================

//Embeds
var messageEmbeds = require('../../../JSON/embeds/messages.json');
//===========================================================================

const player = {
			"id":"",
			"name":"",
			"privateChannel":"",
			"image":"",
			"status":[],
			"attr":[],
			"skills":[]
};
var addId = 0;
const optionBase = ['status', 'attr', 'skills', 'final'];
const format = [
		{'name': 'Status', 'color': [0, 0, 255]},
		{'name': 'Atributos', 'color': [0, 255, 0]},
		{'name': 'Pericias', 'color': [255, 0, 0]}
]
const botconfig = require('../../../JSON/botconfig.json');
const embedsArray = [];

module.exports = class extends Command{
	constructor(client){
		super(client, {
			name: 'cp',
			description: 'Inicia a criação de um personagem.',
			options: [
				{
					name:'nickname',
					type:'STRING',
					description:'Nome do personagem que será criado',
					required: true
				},
				{
					name:'player',
					type:'STRING',
					description:'Mencione o usuário que usará esse personagem.',
					required: true
				},
				{
					name:'private-channel',
					type:'CHANNEL',
					description:'Mencione o canal privado do personagem.',
					required: true
				}
			]
		})
	}

	run = (interaction, client) =>{
		 
		const role = interaction.guild.roles.cache.find(r => r.name === botconfig.rpgadm).id;
		if(!interaction.member._roles.includes(role)){
			interaction.channel.send({embeds: [messageEmbeds.noRole]});
			return;
		}
		player.name = interaction.options.getString('nickname').toLowerCase();
		console.log("id cru = "+interaction.options.getString('player'));
		var item = interaction.options.getString('player').split("<@!"); var id = item[1].split(">"); player.id = id[0];
		player.image = interaction.channel.guild.members.cache.find(r => r.id === player.id).user.displayAvatarURL();
		player.privateChannel = interaction.options.getChannel('private-channel');
		console.log(`Nome: ${player.name}`);
		console.log(`ID: ${player.id}`);
		console.log(`Private Channel: ${player.privateChannel.id}`);

		addMethod(interaction, optionBase[0]);
	}
}
function addMethod(interaction, option){
	if(option == optionBase[0]){
		messageEmbeds.msg.title = format[0].name;
		messageEmbeds.msg.description = `Defina um ${format[0].name.toLowerCase()} para o personagem e o valor maximo`;
		messageEmbeds.msg.color = format[0].color;
	}
	else if(option == optionBase[1]){
		messageEmbeds.msg.title = format[1].name;
		messageEmbeds.msg.description = `Defina um ${format[1].name.toLowerCase().substr(0, format[1].length-1)} para o personagem e o valor maximo`;
		messageEmbeds.msg.color = format[1].color;
	}
	else if(option == optionBase[2]){
		messageEmbeds.msg.title = format[2].name;
		messageEmbeds.msg.description = `Defina uma ${format[2].name.toLowerCase().substr(0, format[2].length-1)} para o personagem e o valor maximo`;
		messageEmbeds.msg.color = format[2].color;
	}
	player.privateChannel.send({embeds:[messageEmbeds.msg], ephemeral: true})
	.then((msg) =>{
		const filter = b => b.author.id === interaction.user.id;
		player.privateChannel.awaitMessages({filter, max:1})
		.then((collected) =>{
			msg.delete();
			if(collected.first().content.toLowerCase() == 'cancel'){
				return player.privateChannel.send({content:'Ficha cancelada'})
					.then(() =>{
						setTimeout(() => pChannel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
					});
			}
			if(collected.first().content.toLowerCase() == 'next'){
				if (option == optionBase[0]) {
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
			}
			var collect = collected.first().content.split(/(\d)/);
			interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
			var globalVal = "";
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

			player.privateChannel.send({content:`Adicionar mais ${messageEmbeds.msg.title.toLowerCase()}?`, ephemeral:true, components:[YesNo]})
			.then((msg) =>{
				const filter = b => b.user.id === interaction.user.id;
				player.privateChannel.awaitMessageComponent({filter, max:1})
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
					else if(collected.customId == 'no' && option == optionBase[3]){
						showPagination(interaction, embedStatus(interaction, player), embedAttr(interaction, player), embedSkill(interaction, player), player);
						registerPlayer(interaction, player);
					}
					else
						return;
				})
			})

		});
	});
}
function saveDelete(interaction, embed, option){
	const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
	pChannel.send({embeds:embed, components:[Save_Edit_Delete]})
	.then((msg) =>{
		const filter = b => b.user.id === interaction.user.id;
		pChannel.awaitMessageComponent({filter, max:1})
		.then((collected) =>{
			msg.delete();
			if(collected.customId == 'save'){
				if(option == optionBase[0]){
					addMethod(interaction, optionBase[1]);
					addId = 0;
				}
				else if(option == optionBase[1]){
					addMethod(interaction, optionBase[2]);
					addId = 0;
				}
				else if(option == optionBase[2]){
					showPagination(interaction, embedStatus(interaction, player), embedAttr(interaction, player), embedSkill(interaction, player), player);
					registerPlayer(interaction, player);
				}
			}
			else if(collected.customId == 'del'){
				pChannel.send({content:`Reiniciando edição de ${messageEmbeds.msg.title}`, ephemeral: true})
					.then(() =>{
							setTimeout(() => pChannel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
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
function edit(interaction, option, object, embed){
	let editEmbed = {
		title: messageEmbeds.msg.title,
		fields: [],
		color: messageEmbeds.msg.color
	}
	for(let i in object){
		editEmbed.fields[i] = {
			name: `__**${parseInt(i)+1}: ${object[i].name.substr(0, 1).toUpperCase()+object[i].name.substr(1, object[i].name.length)}**__`,
			value: object[i].maxValue
		}
	}
	player.privateChannel.send({embeds: [editEmbed], content:`Digite o número do item a editar:`})
		.then((msg) =>{
			const filter = b => b.author.id === interaction.user.id;
			player.privateChannel.awaitMessages({filter, max:1})
				.then((collectId) =>{
					msg.delete();
					const id = parseInt(collectId.first().content) - 1;
					interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
					addId = id;
					editEmbed = {
						title: messageEmbeds.msg.title,
						fields: [
							{
								name: `__**Nome: ${object[id].name.substr(0, 1).toUpperCase()+object[id].name.substr(1, object[id].name.length)}**__`,
								value: `Valor: ${object[id].maxValue}`
							}
						],
						color: messageEmbeds.msg.color
					}
					player.privateChannel.send({embeds: [editEmbed], content:`Digite "NovoNome NovoValor"`})
						.then((msg) =>{
							const filter = b => b.author.id === interaction.user.id;
							player.privateChannel.awaitMessages({filter, max:1})
								.then((collectChange) =>{
									msg.delete();
									const change = collectChange.first().content.split(/(\d)/);
									interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
									var globalVal = "";
									for(let i in change){
										if(!isNaN(change[i])){
											globalVal += change[i];
										}
									}
									console.log("========\nANTIGO "+messageEmbeds.msg.title.toUpperCase());
									for(let i in object){
										console.log(object[i]);
									}
									object.splice(addId, 1);
									object.push({
										"id":addId,
										"name":change[0].toLowerCase(),
										"value":globalVal,
										"maxValue":globalVal
									});
									console.log(`${change[0]} adicionado`);
									console.log("========\nNOVO "+messageEmbeds.msg.title.toUpperCase());
									for(let i in object){
										console.log(object[i]);
									}
									if(option == optionBase[0])
										embed = embedStatus(interaction, player);
									else if(option == optionBase[1])
										embed = embedAttr(interaction, player);
									else if(option == optionBase[2])
										embed = embedSkill(interaction, player);
									saveDelete(interaction, embed, option);
								}).catch((err) =>{
									console.log(err);
								});
						});
				}).catch((err) =>{
					console.log(err);
				});	
		});
}
