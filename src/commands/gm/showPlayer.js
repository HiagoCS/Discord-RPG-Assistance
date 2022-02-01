//APIS
const {MessageActionRow, MessageButton} = require('discord.js');
const {pagination} = require('reconlx');
const fs = require('fs');

//Discord event
const Command = require('../../structures/Command');

//Embeds
const player_card = require('../../../JSON/embeds/player_card.json');
const listsEmbeds = require('../../../JSON/embeds/list.json');
const messageEmbeds = require('../../../JSON/embeds/messages.json');

//Functions
const showPagination = require('../../modulesExports/functions/pagination.js');
const embedStatus = require('../../modulesExports/functions/embedStatus.js');
const embedAttr = require('../../modulesExports/functions/embedAttr.js');
const embedSkill = require('../../modulesExports/functions/embedSkill.js');
module.exports = class extends Command{
	constructor(client){
		super(client, {
			name:'sp',
			description:'Exibe os personagens criados.',
			options:[
				{
					name: 'nickname',
					type: 'STRING',
					description:'Nome do personagem para exibir.'
				}
			]
		})
	}

	run = (interaction) =>{
		const role = interaction.guild.roles.cache.find(r => r.name === 'Cesár').id;
		if(interaction.member._roles.includes(role)){
			if(interaction.options.getString('nickname')){
				try{
					const player = require(`../../../JSON/fichas/${interaction.options.getString('nickname').toLowerCase()}.json`)
					showPagination(interaction, embedStatus(interaction, player), embedAttr(interaction, player), embedSkill(interaction, player), player);
				}
				catch{
					messageEmbeds.error.description = `Este personagem não existe, use novamente o comando com um personagem existente`;
					return interaction.channel.send({embeds: [messageEmbeds.error]})
						.then(() =>{
							setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 8000);
						});
				}	
			}
			else{
				let filesList = fs.readdirSync("./JSON/fichas");filesList.shift();
				for(let i in filesList){
					const file = require(`../../../JSON/fichas/${filesList[i]}`);
					listsEmbeds.sp.fields[i] = {
						name: file.name.substr(0, 1).toUpperCase()+file.name.substr(1, file.name.length),
						value: interaction.channel.guild.members.cache.find(r => r.id === file.id).user.username
					}
				}
				interaction.channel.send({embeds: [listsEmbeds.sp], content:`Digite o nome do personagem:`, ephemeral: true})
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
								showPagination(interaction, embedStatus(interaction, player), embedAttr(interaction, player), embedSkill(interaction, player), player);
							}).catch((err) =>{
								messageEmbeds.error.description = `Este personagem não existe, use novamente o comando com um personagem existente`
								interaction.channel.messages.cache.find(b => b.author.id === interaction.user.id).delete();
								return interaction.channel.send({embeds: [messageEmbeds.error]})
									.then(() =>{
										setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 8000);
									});
							});
					}).catch((err) =>{
						console.log(err)
					});	
			}
		}
		else{
			let files = fs.readdirSync("./JSON/fichas"); files.shift();
			var player = null;
			for(let i in files){
				let filesList = require(`../../../JSON/fichas/${files[i]}`);
				if(filesList.id == interaction.user.id){
					player = filesList;
				}
			}

			if(player){
				showPagination(interaction, embedStatus(interaction, player), embedAttr(interaction, player), embedSkill(interaction, player), player);
			}
			else{
				messageEmbeds.alert.description = `Sem personagem para exibir`;
				interaction.channel.send({embeds: [messageEmbeds.alert]})
					.then(() =>{
						setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
					});
			}
		}
	}
}
//
