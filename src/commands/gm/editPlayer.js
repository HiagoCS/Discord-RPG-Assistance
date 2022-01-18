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
//-----------------------------------
//Globals Variables
var globalId = 0;
let player;
const optionBase = ['status', 'attr', 'skills', 'final'];
//---------------------------
//Buttons
const selectEmbeds = require('../../modulesExports/buttons/selectEmbeds.js');
const Save_Edit_Delete = require(`../../modulesExports/buttons/save_edit_delete.js`);
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
		if(interaction.options.getString('nickname')){
			player = require(`../../../JSON/fichas/${interaction.options.getString('nickname').toLowerCase()}.json`);
			msgEmbeds.msg.title = `Editar quais pontos?`;
			msgEmbeds.msg.description = `Escolha o que você ira editar do personagem ${player.name.substr(0, 1).toUpperCase()+player.name.substr(1, player.name.length)}`;
			interaction.channel.send({embeds:[msgEmbeds.msg], components:[selectEmbeds]})
				.then(() =>{
					const filter = b => b.user.id === interaction.user.id;
					interaction.channel.awaitMessageComponent({filter, max:1})
						.then((collected) =>{
							if(collected.customId == 'status'){
								edit(interaction, collected.customId, player.status);
							}
							else if(collected.customId == 'attr'){
								edit(interaction, collected.customId, player.attr);
							}
							else if(collected.customId == 'skills'){
								edit(interaction, collected.customId, player.skills);
							}
						}).catch((err) =>{
							console.log(err);
						});
				});
		}

	}
}

//======EDIT FUNCTION=========//
function edit(interaction, option, object){
	let editEmbed = {
		fields: []
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
					globalId = id;
					editEmbed = {
						fields: [
							{
								name: `__**Nome: ${object[id].name}**__`,
								value: `Valor: ${object[id].value}/${object[id].maxValue}`
							}
						]
					}
					interaction.channel.send({embeds: [editEmbed], content:`Digite "NovoNome NovoValor"`})
						.then(() =>{
							const filter = b => b.author.id === interaction.user.id;
							interaction.channel.awaitMessages({filter, max:1})
								.then((collectChange) =>{
									const change = collectChange.first().content.split(" ");
									console.log("========\nANTIGO STATUS");
									for(let i in object){
										console.log(object[i]);
									}
									object.splice(globalId, 1);
									object.push({
										"id":globalId,
										"name":change[0],
										"value":change[1],
										"maxValue":change[1]
									});
									console.log(`${change[0]} adicionado`);
									console.log("========\nNOVO STATUS");
									for(let i in object){
										console.log(object[i]);
									}
									if(option == optionBase[0]){
										embedStatus(interaction);;
										saveDelete(interaction, player_card.status, option);
									}
									else if(option == optionBase[1]){
										embedAttr(interaction);
										saveDelete(interaction, player_card.attr, option);
									}
									else if(option == optionBase[2]){
										embedSkill(interaction);
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
	interaction.channel.send({embeds:[embed], components:[Save_Edit_Delete]})
	.then(() =>{
		const filter = b => b.user.id === interaction.user.id;
		interaction.channel.awaitMessageComponent({filter, max:1})
		.then((collected) =>{
			if(collected.customId == 'save'){
				embedStatus(interaction);
				embedAttr(interaction);
				embedSkill(interaction);
				embedFinal(interaction);	
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