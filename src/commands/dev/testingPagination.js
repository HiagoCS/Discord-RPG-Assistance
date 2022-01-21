const Command = require('../../structures/Command');
const {MessageActionRow, MessageButton} = require('discord.js');
const fs = require('fs');
const player_card = require('../../../JSON/embeds/player_card.json');
const {pagination} = require('reconlx');

const paginationButtons = require('../../modulesExports/buttons/paginationButtons.js');

var actualPage = 1;
module.exports = class extends Command{
	constructor(client){
		super(client, {
			name: 'testpagination',
			description: 'Testa paginação de embeds.',
		})
	}

	run = (interaction) =>{
		const embed01 = {
			title: "Embed 01",
			description:"This is the first embed.",
			footer: {
				text:''
			}
		}
		const embed02 = {
			title: "Embed 02",
			description:"This is the second embed.",
			footer: {
				text:''
			}
		}
		const embed03 = {
			title: "Embed 03",
			description:"This is the third embed.",
			footer: {
				text:''
			}
		}
		const pages = [embed01, embed02, embed03];
		pagination({
		embeds: pages,
		message: interaction,
		fastSkip: true,
		channel: interaction.channel,
		author: interaction.user,
		time: 10000
	}).catch((err) =>{
		console.log(err);
	});
	}
}