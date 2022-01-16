const {MessageActionRow, MessageButton} = require('discord.js');
const {pagination} = require('reconlx');
const fs = require('fs');
const Command = require('../../structures/Command');
const player_card = require('../../../JSON/embeds/player_card.json');

module.exports = class extends Command{
	constructor(client){
		super(client, {
			name: 'testembed',
			description: 'Testa os estilos de embeds.'
		})
	}
	run = (interaction) =>{
		embedStatus(interaction);
		embedAttr(interaction);
		embedSkill(interaction);
		embedFinal(interaction);

	}
}

function embedStatus(interaction){
	//EMBED STATUS
	player_card.status.author.name = `『📝 ${player.name} 📝』`;
	player_card.status.image.url = interaction.channel.guild.members.cache.find(r => r.id === '450152722969133056').user.displayAvatarURL();;
	for(let i in player.status){
		var colorMix = ['```diff\n- ', '```fix\n', '```diff\n+ '];
		var numMix = Math.floor(Math.random() * colorMix.length);
		player_card.status.fields[i] = {
			name: `__**${player.status[i].name}**__`,
			value: colorMix[numMix]+player.status[i].value+'/'+player.status[i].maxValue+'\n```'
		}
	}
	//-----------------------
}
function embedAttr(interaction){
	//EMBED ATRIBUTOS
	player_card.attr.thumbnail.url = interaction.channel.guild.members.cache.find(r => r.id === '450152722969133056').user.displayAvatarURL();;
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
	player_card.skill.thumbnail.url = interaction.channel.guild.members.cache.find(r => r.id === '450152722969133056').user.displayAvatarURL();;
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

}