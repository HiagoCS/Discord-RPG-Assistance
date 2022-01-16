const {MessageActionRow, MessageButton} = require('discord.js');
const {pagination} = require('reconlx');
const fs = require('fs');
const {join} = require('path');
const Command = require('../../structures/Command');
const player_card = require('../../../JSON/embeds/player_card.json');
const listsEmbeds = require('../../../JSON/embeds/list.json');
let localplayer = {
	"id":[],
	"username":[]
};

module.exports = class extends Command{
	constructor(client){
		super(client, {
			name:'sp',
			description:'Exibe os personagens criados.'
		})
	}

	run = (interaction) =>{
		let files = fs.readdirSync("./JSON/fichas"); const list = [];
		for(let i in files){
			const idBrute = require(`../../../JSON/fichas/${files[i]}`);
			localplayer.id.push(idBrute.id);
			const username = interaction.channel.guild.members.cache.find(r => r.id === localplayer.id[i]).user.username;
			localplayer.username.push(username);
			list[i] = files[i].split('.json');
			const playerName = list[i][0].substr(0, 1).toUpperCase()+list[i][0].substr(1, list[i][0].length);
			listsEmbeds.sp.fields[i] = {
				name:`${parseInt(i)+1}: ${playerName}`,
				value: username
			}
		}
		interaction.channel.send({embeds: [listsEmbeds.sp], content:`Digite o nome do personagem:`})
			.then(() =>{
				const filter = b => b.author.id === interaction.user.id;
				interaction.channel.awaitMessages({filter, max:1})
					.then((collected) =>{
						const collect = collected.first().content.toLowerCase();
						const player = require(`../../../JSON/fichas/${collect}.json`);
						embedStatus(interaction, player);
						embedAttr(interaction, player);
						embedSkill(interaction, player);
						embedFinal(interaction, player);
					}).catch((err) =>{
						console.log(err);
					})
			});
	}
}

function embedStatus(interaction, player){
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
function embedAttr(interaction, player){
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
function embedSkill(interaction, player){
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
function embedFinal(interaction, player){
	const pages = [player_card.status, player_card.attr, player_card.skill];
	pagination({
		embeds: pages,
		message: interaction,
		fastSkip: true,
		pageTravel: true,
		channel: interaction.channel,
		author: interaction.user
	});
}