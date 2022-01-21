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
const player_card = require('../../../JSON/embeds/player_card.json');
var messageEmbeds = require('../../../JSON/embeds/messages.json');
const listsEmbeds = require('../../../JSON/embeds/list.json');
//===========================================================================

let localplayer = {
	"id":[],
	"username":[]
};

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
		const role = {
			'id': '852373845351989289',
			'name': ''
		}
		role.name = interaction.guild.roles.cache.find(r => r.id === role.id).name;
		if(interaction.member._roles.includes(role.id)){
			if(interaction.options.getString('status') == null && interaction.options.getString('valor') == null && interaction.options.getString('personagem') == null){
				messageEmbeds.msg.title = `🚫 ERRO 🚫`;
				messageEmbeds.msg.description = `Indique um personagem ou de um "List" para exibir uma lista de personagens e indicar um deles.`;
				messageEmbeds.msg.color = [255, 0, 0];
				interaction.channel.send({embeds: [messageEmbeds.msg], ephemeral: true});
				return;
			}
			else if(interaction.options.getString('status') == null && interaction.options.getString('valor') == null && interaction.options.getString('personagem') != null){
				if(interaction.options.getString('personagem').toLowerCase() == 'list'){
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
					interaction.channel.send({embeds: [listsEmbeds.sp], content:`Digite o nome do personagem:`})
							.then((msg) =>{
								const filter = b => b.author.id === interaction.user.id;
								interaction.channel.awaitMessages({filter, max:1})
									.then((collected) =>{
										msg.delete();
										const collect = collected.first().content.toLowerCase();
										const player = require(`../../../JSON/fichas/${collect}.json`);
										player_card.status = embedStatus(interaction, player);
										interaction.channel.send({embeds: [player_card.status], ephemeral:true});
									}).catch((err) =>{
										return interaction.channel.send({content:"Este personagem não existe, use novamente o comando com um personagem existente"});
									});
							}).catch((err) =>{
								console.log(err)
							});
				}
				else if(interaction.options.getString('personagem').toLowerCase() != 'list'){
					try{
						const player = require(`../../../JSON/fichas/${interaction.options.getString('personagem').toLowerCase()}.json`)
						player_card.status = embedStatus(interaction, player);
						interaction.channel.send({embeds: [player_card.status], ephemeral:true});
					}
					catch (err){
						return interaction.channel.send({content: 'Não existe este personagem!'});
					}
				}
			}
			if(interaction.options.getString('status') != null && interaction.options.getString('valor') != null){
				if(interaction.options.getString('personagem').toLowerCase() == 'list'){
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
					interaction.channel.send({embeds: [listsEmbeds.sp], content:`Digite o nome do personagem:`})
						.then((msg) =>{
							const filter = b => b.author.id === interaction.user.id;
							interaction.channel.awaitMessages({filter, max:1})
								.then((collected) =>{
									msg.delete();
									const collect = collected.first().content.toLowerCase();
									const player = require(`../../../JSON/fichas/${collect}.json`);
									playerMethod(interaction, player);
								}).catch((err) =>{
									return interaction.channel.send({content:"Este personagem não existe, use novamente o comando com um personagem existente"});
								});
						}).catch((err) =>{
							console.log(err)
						});
				}
				else{
					try{
						const player = require(`../../../JSON/fichas/${interaction.options.getString('personagem').toLowerCase()}.json`)
						playerMethod(interaction, player);
					}
					catch (err){
						return interaction.channel.send({content: 'Não existe este personagem!'});
					}
				}
			}
		}
		else{
			let files = fs.readdirSync("./JSON/fichas");
			for(let i in files){
				const filesList = require(`../../../JSON/fichas/${files[i]}`);
				if(filesList.id == interaction.user.id){
					if(interaction.options.getString('status') == null && interaction.options.getString('valor') == null && interaction.options.getString('personagem') == null){
						player_card.status == embedStatus(interaction, filesList);
						interaction.channel.send({embeds: [player_card.status], ephemeral: true});
					}
					else if(interaction.options.getString('status') == null && interaction.options.getString('valor') == null && interaction.options.getString('status') == null && interaction.options.getString('valor') != null){
						if(interaction.options.getString('personagem').toLowerCase() == filesList.name.toLowerCase()){
							player_card.status == embedStatus(interaction, filesList);
							interaction.channel.send({embeds: [player_card.status], ephemeral: true});
						}
						else{
							messageEmbeds.msg.title = `🚫 PERMISSÃO NEGADA 🚫`;
							messageEmbeds.msg.description = `Você não tem permissão para mexer com o personagem ${interaction.options.getString('personagem').substr(0, 1).toUpperCase()+interaction.options.getString('personagem').substr(1, interaction.options.getString('personagem').length)}`
							messageEmbeds.msg.color = [255, 0, 0];
							interaction.channel.send({embeds: [messageEmbeds.msg], ephemeral: true});
						}
					}
					if(interaction.options.getString('personagem') != null){
						if(interaction.options.getString('personagem').toLowerCase() != filesList.name.toLowerCase() && interaction.options.getString('personagem').toLowerCase() != 'list'){
							messageEmbeds.msg.title = `🚫 PERMISSÃO NEGADA 🚫`;
							messageEmbeds.msg.description = `Você não tem permissão para mexer com o personagem ${interaction.options.getString('personagem').substr(0, 1).toUpperCase()+interaction.options.getString('personagem').substr(1, interaction.options.getString('personagem').length)}`
							messageEmbeds.msg.color = [255, 0, 0];
							interaction.channel.send({embeds: [messageEmbeds.msg], ephemeral: true});
						}
						else if(interaction.options.getString('personagem').toLowerCase() == 'list'){
							messageEmbeds.msg.title = `🚫 PERMISSÃO NEGADA 🚫`;
							messageEmbeds.msg.description = `Você não tem permissão para executar o comando ${interaction.options.getString('personagem').substr(0, 1).toUpperCase()+interaction.options.getString('personagem').substr(1, interaction.options.getString('personagem').length)}`
							messageEmbeds.msg.color = [255, 0, 0];
							interaction.channel.send({embeds: [messageEmbeds.msg], ephemeral: true});
						}
					}
					else if(interaction.options.getString('personagem') == null || interaction.options.getString('personagem').toLowerCase() == filesList.name.toLowerCase()){
						playerMethod(interaction, filesList);
					}
				}
			}
			
		}
	}
}
