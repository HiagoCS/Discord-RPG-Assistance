const Command = require('../../structures/Command');
const {MessageActionRow, MessageButton} = require('discord.js');
const pagination = require('reconlx');
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
		.setStyle('WARNING'),
		new MessageButton()
		.setCustomId('delete'))
const player = {
			"id":"",
			"name":"",
			"image":"",
			"status":[],
			"attr":[],
			"skills":[]
};
var addId = 0;

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
				}
			]
		})
	}

	run = (interaction) =>{
		player.name = interaction.options.getString('nickname');
		console.log(`Nome: ${player.name}`);
		addMethod(interaction, "status");
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
			if(option == 'status'){
				player.status[addId] = {
					'name':collect[0], 
					'value':collect[1],
					'maxValue':collect[1]
				}
				console.log("========\nSTATUS");
				for(let i in player.status){
					console.log(player.status[i]);
				}
			}
			else if(option == 'atributo'){
				player.attr[addId] = {
					'name':collect[0], 
					'value':collect[1],
					'maxValue':collect[1]
				}
				console.log("===========\nATRIBUTOS");
				for(let i in player.attr){
					console.log(player.attr[i]);
				}
			}
			else if(option == 'pericia'){
				player.skills[addId] = {
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
					else if(collected.customId == 'no' && option == 'status'){
						embedStatus(interaction);
						interaction.channel.send({embeds:[embedStatus]})
						addMethod(interaction, 'atributo');
						addId = 0;
					}
					else if(collected.customId == 'no' && option == 'atributo'){
						addMethod(interaction, 'pericia');
						addId = 0;
					}
					else if(collected.customId == 'no' && option == 'pericia'){
						interaction.channel.send({content:`Mencione o jogador que usará esse personagem`})
							.then(() =>{
								const filter = b => b.author.id === interaction.user.id;
								interaction.channel.awaitMessages({filter, max:1})
								.then((collected) =>{
									console.log("id cru = "+collected.first().content);
									var item = collected.first().content.split("<@");
									var id = item[1].split(">");
									player.id = id[0];
									player.image = interaction.channel.guild.members.cache.find(r => r.id === id[0]).user.displayAvatarURL();
									embedFinal(interaction);
								}).catch((err) =>{
									console.log(err);
								})
							});
					}
					else
						return;
				})
			})

		});
	});
}
function embedStatus(interaction){
	//EMBED STATUS
	player_card.status.author.name = player.name;
	player_card.status.thumbnail.url = player.image;
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

}