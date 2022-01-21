//APIS
const {MessageActionRow, MessageButton} = require('discord.js');
const {pagination} = require('reconlx');
const fs = require('fs');

//Discord event
const Command = require('../../structures/Command');

//Embeds
const player_card = require('../../../JSON/embeds/player_card.json');
const listsEmbeds = require('../../../JSON/embeds/list.json');

//Functions
const showPagination = require('../../modulesExports/functions/pagination.js');
const embedStatus = require('../../modulesExports/functions/embedStatus.js');
const embedAttr = require('../../modulesExports/functions/embedAttr.js');
const embedSkill = require('../../modulesExports/functions/embedSkill.js');

let localplayer = {
	"id":[],
	"username":[]
};

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
		const role = {
			'id': '852373845351989289',
			'name': ''
		}
		role.name = interaction.guild.roles.cache.find(r => r.id === role.id).name;
		if(interaction.member._roles.includes(role.id)){
			if(interaction.options.getString('nickname')){
				try{
					const player = require(`../../../JSON/fichas/${interaction.options.getString('nickname').toLowerCase()}.json`)
					player_card.status = embedStatus(interaction, player);
					player_card.attr = embedAttr(interaction, player);
					player_card.skill = embedSkill(interaction, player);
					showPagination(interaction, player_card, player);
				}
				catch (err){
					return interaction.channel.send({content: 'Não existe este personagem!'});
				}	
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
						name:`${playerName}`,
						value: username
					}
				}
				interaction.channel.send({embeds: [listsEmbeds.sp], content:`Digite o nome do personagem:`, ephemeral: true})
					.then((msg) =>{
						const filter = b => b.author.id === interaction.user.id;
						interaction.channel.awaitMessages({filter, max:1})
							.then((collected) =>{
								msg.delete({timeout: 3000});
								const collect = collected.first().content.toLowerCase();
								const player = require(`../../../JSON/fichas/${collect}.json`);
								player_card.status = embedStatus(interaction, player);
								player_card.attr =embedAttr(interaction, player);
								player_card.skill =embedSkill(interaction, player);
								showPagination(interaction, player_card, player);
							}).catch((err) =>{
								return interaction.channel.send({content:"Este personagem não existe, use novamente o comando com um personagem existente"});
							});
					}).catch((err) =>{
						console.log(err)
					});	
			}
		}
		else{
			let files = fs.readdirSync("./JSON/fichas");
			const playersArray = [];
			var player;
			for(let i in files){
				const filesList = require(`../../../JSON/fichas/${files[i]}`);
				if(filesList.id == interaction.user.id){
					if(interaction.options.getString('nickname') != null){
						if(interaction.options.getString('personagem').toLowerCase() != filesList.name.toLowerCase()){
							messageEmbeds.msg.title = `🚫 PERMISSÃO NEGADA 🚫`;
							messageEmbeds.msg.description = `Você não tem permissão para mexer com o personagem ${interaction.options.getString('nickname').substr(0, 1).toUpperCase()+interaction.options.getString('nickname').substr(1, interaction.options.getString('nickname').length)}`
							messageEmbeds.msg.color = [255, 0, 0];
							interaction.channel.send({embeds: [messageEmbeds.msg], ephemeral: true});
						}
					}
					else{
						player_card.status = embedStatus(interaction, filesList);
						player_card.attr = embedAttr(interaction, filesList);
						player_card.skill = embedSkill(interaction, filesList);
						showPagination(interaction, player_card, filesList);
					}
				}
			}
			
		}
	}
}