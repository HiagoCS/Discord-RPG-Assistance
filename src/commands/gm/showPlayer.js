const {MessageActionRow, MessageButton} = require('discord.js');
const {pagination} = require('reconlx');
const fs = require('fs');
const {join} = require('path');
const Command = require('../../structures/Command');
const player_card = require('../../../JSON/embeds/player_card.json');
const listsEmbeds = require('../../../JSON/embeds/list.json');

module.exports = class extends Command{
	constructor(client){
		super(client, {
			name:'sp',
			description:'Exibe os personagens criados.',
			options: [
				{
					name:'nickname',
					type:'STRING',
					description:'Nome do personagem.',
					required: true
				}
			]
		})
	}

	run = (interaction) =>{
		let files = fs.readdirSync("../../../JSON/fichas");
		console.log(files);
		/*
		const playerName = interaction.options.getString('nickname').toLowerCase();
		const player = require(`../../../JSON/fichas/${playerName}.json`);
		embedStatus(interaction, player);
		embedAttr(interaction, player);
		embedSkill(interaction, player);
		embedFinal(interaction, player);
		*/
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