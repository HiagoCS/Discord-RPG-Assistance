//APIS
const {MessageActionRow, MessageButton} = require('discord.js');
const {pagination} = require('reconlx');
const fs = require('fs');
//=====================================================================
//Discord events
const Command = require('../../structures/Command');
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
const player_card = require('../../../JSON/embeds/player_card.json');
var messageEmbeds = require('../../../JSON/embeds/messages.json');
//===========================================================================

const player = {
			"id":"",
			"name":"",
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
					required: true				}
			]
		})
	}

	run = (interaction) =>{
		player.name = interaction.options.getString('nickname');
		console.log("id cru = "+interaction.options.getString('player'));
		var item = interaction.options.getString('player').split("<@!"); var id = item[1].split(">"); player.id = id[0];
		player.image = interaction.channel.guild.members.cache.find(r => r.id === player.id).user.displayAvatarURL();
		console.log(`Nome: ${player.name}`);
		console.log(`ID: ${player.id}`);
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
	interaction.channel.send({embeds:[messageEmbeds.msg], ephemeral: true})
	.then(() =>{
		const filter = b => b.author.id === interaction.user.id;
		interaction.channel.awaitMessages({filter, max:1})
		.then((collected) =>{
			if(collected.first().content.toLowerCase() == 'cancel')
				return interaction.channel.send({content:'Ficha cancelada'});
			var collect = collected.first().content.split(" ");
			if(option == optionBase[0]){
				player.status[addId] = {
					'id':addId,
					'name':collect[0], 
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
					'name':collect[0], 
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
					'name':collect[0], 
					'value':collect[1],
					'maxValue':collect[1]
				}
				console.log("===========\nPERICIAS");
				for(let i in player.skills){
					console.log(player.skills[i]);
				}
			}

			interaction.channel.send({content:`Adicionar mais ${messageEmbeds.msg.title.toLowerCase()}?`, ephemeral:true, components:[YesNo]})
			.then(() =>{
				const filter = b => b.user.id === interaction.user.id;
				interaction.channel.awaitMessageComponent({filter, max:1})
				.then((collected) =>{
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
					else if(collected.customId == 'no' && option == optionBase[3]){
						showPagination(interaction, player_card, player);
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
	interaction.channel.send({embeds:[embed], components:[Save_Edit_Delete]})
	.then(() =>{
		const filter = b => b.user.id === interaction.user.id;
		interaction.channel.awaitMessageComponent({filter, max:1})
		.then((collected) =>{
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
					showPagination(interaction, player_card, player);
					registerPlayer(interaction, player);
				}
			}
			else if(collected.customId == 'del'){
				interaction.channel.send({content:`Reiniciando ${option} config`, ephemeral: true});
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
function edit(interaction, option, object, embed){
	let editEmbed = {
		title: messageEmbeds.msg.title,
		fields: [],
		color: messageEmbeds.msg.color
	}
	for(let i in object){
		editEmbed.fields[i] = {
			name: `__**${parseInt(i)+1}: ${object[i].name}**__`,
			value: object[i].value+'/'+object[i].maxValue
		}
	}
	interaction.channel.send({embeds: [editEmbed], content:`Digite o número do item a editar:`})
		.then(() =>{
			const filter = b => b.author.id === interaction.user.id;
			interaction.channel.awaitMessages({filter, max:1})
				.then((collectId) =>{
					const id = parseInt(collectId.first().content) - 1;
					addId = id;
					editEmbed = {
						title: messageEmbeds.msg.title,
						fields: [
							{
								name: `__**Nome: ${object[id].name}**__`,
								value: `Valor: ${object[id].value}/${object[id].maxValue}`
							}
						],
						color: messageEmbeds.msg.color
					}
					interaction.channel.send({embeds: [editEmbed], content:`Digite "NovoNome NovoValor"`})
						.then(() =>{
							const filter = b => b.author.id === interaction.user.id;
							interaction.channel.awaitMessages({filter, max:1})
								.then((collectChange) =>{
									const change = collectChange.first().content.split(" ");
									console.log("========\nANTIGO "+messageEmbeds.msg.title.toUpperCase());
									for(let i in object){
										console.log(object[i]);
									}
									object.splice(addId, 1);
									object.push({
										"id":addId,
										"name":change[0],
										"value":change[1],
										"maxValue":change[1]
									});
									console.log(`${change[0]} adicionado`);
									console.log("========\nNOVO "+messageEmbeds.msg.title.toUpperCase());
									for(let i in object){
										console.log(object[i]);
									}
									if(option == optionBase[0])
										player_card.status = embedStatus(interaction, player);
									else if(option == optionBase[1])
										player_card.attr = embedAttr(interaction, player);
									else if(option == optionBase[2])
										player_card.skill = embedSkill(interaction, player);
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
