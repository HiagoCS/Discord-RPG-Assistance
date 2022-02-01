//APIS
const fs = require('fs');

//Discord event
const Command = require('../../structures/Command');

//Embeds
const messageEmbeds = require('../../../JSON/embeds/messages.json');
const listsEmbeds = require('../../../JSON/embeds/list.json');

//Global Variables
let localplayer = {
	"id":[],
	"username":[]
};

module.exports = class extends Command{
	constructor(client){
		super(client, {
			name: 'delete',
			description: `Deleta um personagem do banco de dados do Cellbot v13`,
			options: [
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
			if(interaction.options.getString('nickname') != null){
				try{
					const player = require(`../../../JSON/fichas/${interaction.options.getString('nickname').toLowerCase()}.json`);
					const pChannel = interaction.guild.channels.cache.find(r => r.id === player.privateChannel.id);
					const deletedPlayer = player.name;
					const deletedPlayerId = player.id;
					messageEmbeds.msg.title = `✔️ Deletado ✔️`
					messageEmbeds.msg.description = `${deletedPlayer.substr(0, 1).toUpperCase()+deletedPlayer.substr(1, deletedPlayer.length)} excluido com sucesso!`
					messageEmbeds.msg.color = [0, 255, 0];
					interaction.user.send({embeds:[messageEmbeds.msg]});
					pChannel.delete();
					fs.unlinkSync(`./JSON/fichas/${interaction.options.getString('nickname').toLowerCase()}.json`);
				}
				catch(err){
					messageEmbeds.alert.description = `Este personagem não existe, delete um personagem existente`;
					interaction.channel.send({embeds:[messageEmbeds.alert]})
						.then(() =>{
							setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 8000);
						});
					return console.log(err);
				}
			}
			else if (interaction.options.getString('nickname') == null) {
				let files = fs.readdirSync("./JSON/fichas"); const list = []; files.shift();
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
								msg.delete();
								const collect = collected.first().content.toLowerCase();
								const player = require(`../../../JSON/fichas/${collect}.json`);
								interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
								const pChannel = interaction.guild.channels.cache.find(r => r.id === player.privateChannel.id);
								const deletedPlayer = player.name;
								const deletedPlayerId = player.id;
								messageEmbeds.msg.title = `✔️ Deletado ✔️`
								messageEmbeds.msg.description = `${deletedPlayer.substr(0, 1).toUpperCase()+deletedPlayer.substr(1, deletedPlayer.length)} excluido com sucesso!`
								messageEmbeds.msg.color = [0, 255, 0];
								interaction.user.send({embeds:[messageEmbeds.msg]});
								pChannel.delete();
								fs.unlinkSync(`./JSON/fichas/${collect}.json`);
							}).catch((err) =>{
								messageEmbeds.error.description = `Este personagem não existe, use novamente o comando com um personagem existente`;
								interaction.guild.channels.cache.find(c => c.id === interaction.channel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
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
			for(let i in files){
				const player = require(`../../../JSON/fichas/${files[i]}`);
				if(player.id == interaction.user.id){
					if(interaction.options.getString('nickname') != null){
						if(interaction.options.getString('nickname').toLowerCase != player.name.toLowerCase()){
							messageEmbeds.msg.title = `🚫 PERMISSÃO NEGADA 🚫`
							messageEmbeds.msg.description = `Você não tem permissão para deletar ${interaction.options.getString('nickname').substr(0, 1).toUpperCase()+interaction.options.getString('nickname').substr(1, interaction.options.getString('nickname').length)}`
							messageEmbeds.msg.color = [255, 0 , 0];
							interaction.channel.send({embeds:[messageEmbeds.msg]})
								.then(() =>{
									setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 8000);
								});
						}
						else{
							const pChannel = interaction.guild.channels.cache.find(r => r.id === player.privateChannel.id);
							const deletedPlayer = player.name;
							const deletedPlayerId = player.id;
							messageEmbeds.msg.title = `✔️ Deletado ✔️`
							messageEmbeds.msg.description = `${deletedPlayer.substr(0, 1).toUpperCase()+deletedPlayer.substr(1, deletedPlayer.length)} excluido com sucesso!`
							messageEmbeds.msg.color = [0, 255, 0];
							interaction.user.send({embeds:[messageEmbeds.msg]});
							pChannel.delete();
							fs.unlinkSync(files[i]);
						}
					}
					else{
						const pChannel = interaction.guild.channels.cache.find(r => r.id === player.privateChannel.id);
						const deletedPlayer = player.name;
						messageEmbeds.msg.title = `✔️ Deletado ✔️`
						messageEmbeds.msg.description = `${deletedPlayer.substr(0, 1).toUpperCase()+deletedPlayer.substr(1, deletedPlayer.length)} excluido com sucesso!`
						messageEmbeds.msg.color = [0, 255, 0];
						interaction.user.send({embeds:[messageEmbeds.msg]})
						pChannel.delete();
						fs.unlinkSync(`./JSON/fichas/${files[i]}`);
					}
				}
				else{
					messageEmbeds.alert.description = `Sem personagem para deletar`;
					return interaction.channel.send({embeds:[messageEmbeds.alert]})
						.then(() =>{
							setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
						});
				}
			}
		}
	}
}