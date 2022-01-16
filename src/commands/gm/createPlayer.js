const {MessageActionRow, MessageButton} = require('discord.js');
const {pagination} = require('reconlx');
const fs = require('fs');
const Command = require('../../structures/Command');
const player_card = require('../../../JSON/embeds/player_card.json');

const YesNo = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId('yes')
			.setLabel('Sim')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('no')
			.setLabel('Não')
			.setStyle('DANGER')
			);
const Save_Edit_Delete = new MessageActionRow()
	.addComponents(
		new MessageButton()
		.setCustomId('save')
		.setLabel('💾')
		.setStyle('SUCCESS'),
		new MessageButton()
		.setCustomId('edit')
		.setLabel('✏️')
		.setStyle('SECONDARY'),
		new MessageButton()
		.setCustomId('del')
		.setLabel('❌')
		.setStyle('DANGER'));
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
	interaction.channel.send({content:`Defina um ${option} para o personagem e o valor maximo`, ephemeral: true})
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

			interaction.channel.send({content:`Adicionar mais ${option}?`, ephemeral:true, components:[YesNo]})
			.then(() =>{
				const filter = b => b.user.id === interaction.user.id;
				interaction.channel.awaitMessageComponent({filter, max:1})
				.then((collected) =>{
					if(collected.customId == 'yes'){
						addMethod(interaction, option);
						addId++;
					}
					else if(collected.customId == 'no' && option == optionBase[0]){
						embedStatus(interaction);
						saveDelete(interaction, player_card.status, option);
					}
					else if(collected.customId == 'no' && option == optionBase[1]){
						embedAttr(interaction);
						saveDelete(interaction, player_card.attr, option);
					}
					else if(collected.customId == 'no' && option == optionBase[2]){
						embedSkill(interaction);
						saveDelete(interaction, player_card.skill, option);
					}
					else if(collected.customId == 'no' && option == optionBase[3]){
						embedFinal(interaction);
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
				else if(option == optionBase[2])
					embedFinal(interaction);
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
					edit(interaction, option, player.skills, player_card.skills);
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
					addId = id;
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
									object.splice(addId, 1);
									object.push({
										"id":addId,
										"name":change[0],
										"value":change[1],
										"maxValue":change[1]
									});
									console.log(`${change[0]} adicionado`);
									console.log("========\nNOVO STATUS");
									for(let i in object){
										console.log(object[i]);
									}
									if(option == optionBase[0])
										embedStatus(interaction);
									else if(option == optionBase[1])
										embedAttr(interaction);
									else if(option == optionBase[2])
										embedSkill(interaction);
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
function embedStatus(interaction){
	//EMBED STATUS
	player_card.status.author.name = `『📝 ${player.name} 📝』`;
	player_card.status.image.url =  player.image;
	for(let i in player.status){
		var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
		var numMix = Math.floor(Math.random() * colorMix.length);
		player_card.status.fields[i] = {
			name: `__**${player.status[i].name}**__`,
			value: colorMix[numMix]+player.status[i].value+'/'+player.status[i].maxValue+'\n```'
		}
	}
}
function embedAttr(interaction){
	//EMBED ATRIBUTOS
	player_card.attr.thumbnail.url = player.image;
	for(let i in player.attr){
		var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
		var numMix = Math.floor(Math.random() * colorMix.length);
		player_card.attr.fields[i] = {
			name: `__**${player.attr[i].name}**__`,
			value: colorMix[numMix]+player.attr[i].value+'/'+player.attr[i].maxValue+'\n```',
			inline: true
		}
	}
	//-------------------------
}
function embedSkill(interaction){
	//EMBED PERICIAS
	player_card.skill.thumbnail.url = player.image;
	for(let i in player.skills){
		var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
		var numMix = Math.floor(Math.random() * colorMix.length);
		player_card.skill.fields[i] = {
			name: `__**${player.skills[i].name}**__`,
			value: colorMix[numMix]+player.skills[i].value+'/'+player.skills[i].maxValue+'\n```',
			inline: true
		}
	}
}
function embedFinal(interaction){
	const pages = [player_card.status, player_card.attr, player_card.skill];
	pagination({
		embeds: pages,
		message: interaction,
		fastSkip: true,
		pageTravel: true,
		channel: interaction.channel,
		author: interaction.user
	});
	var json = JSON.stringify(player);
	fs.writeFile(`JSON/fichas/${player.name.toLowerCase()}.json`, json, {encoding: "utf8"}, (err) =>{
		if (err)console.log(err);
		else{
			interaction.channel.send({content:`${player.name} criado com sucesso!!`});
		}
	});
}