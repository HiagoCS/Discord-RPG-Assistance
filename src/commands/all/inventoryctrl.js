//Discord events
const Command = require('../../structures/Command');
const botconfig = require('../../../JSON/botconfig.json');
const listsEmbeds = require('../../../JSON/embeds/list.json');
const messageEmbeds = require('../../../JSON/embeds/messages.json');
const types = require('../../modulesExports/buttons/inventoryTypes.js');
const cmds = require('../../modulesExports/buttons/inventoryCmds.js');
const pagInv = require('../../modulesExports/functions/paginationInventory.js');
const embedGun = require('../../modulesExports/functions/embedInv.js');
const Save_Edit_Delete = require('../../modulesExports/buttons/save_edit_delete.js');
const registerPlayer = require('../../modulesExports/functions/registerPlayer.js');
const fs = require('fs');
const {MessageActionRow, MessageButton} = require('discord.js');
const embedInv = require('../../modulesExports/functions/embedInv.js');
var globalId = 0;
var addId = 0;
var inventory = {
	'gun': {
		'name':'',
		'dmg':'',
		'ammo':'',
		'maxAmmo':'',
		'formatName':'Arma de Fogo'
	},
	'melle': {
		'name':'',
		'dmg':'',
		'formatName':'Arma Corpo-a-Corpo'
	},
	'coin': {
		'val':'',
		'formatName':'Moeda'
	},
	'bag': {
		'name':'',
		'description':'',
		'formatName':'Coisa'
	}
}
const titles = {
	'name': 'o nome',
	'dmg': 'o dano',
	'ammo': 'a munição',
	'maxAmmo':'a munição máxima',
	'description':'a descrição',
	'val':'o valor'
}
module.exports = class extends Command{
	constructor(client){
		super(client, {
			name: 'inv',
			description: 'Controla o inventário do personagem.',
			options:[
				{
					name: 'cmd',
					description: 'Comando para aplicar no inventário. (ADD, SHOW, RM, EDIT)',
					type: 'STRING',
					required: true
				},
				{
					name: 'player',
					description: 'Personagem para selecionar seu inventário.',
					type: 'STRING'
				},
				{
					name: 'type',
					description: 'Tipo de item que será modificado. (GUN, MELLE, COIN, BAG)',
					type: 'STRING'
				},
				{
					name:'item',
					description: 'Nome do item para modificar.',
					type: 'STRING'
				}
			]
		})
	}
	run = (interaction) =>{
		const role = interaction.guild.roles.cache.find(r => r.name === botconfig.rpgadm).id;
		if(interaction.member._roles.includes(role)){
			if(interaction.options.getString('player')){
				try{
					const player = require(`../../../JSON/fichas/${interaction.options.getString('player').toLowerCase()}.json`)
					home(interaction, player, interaction.options.getString('cmd'));
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
								home(interaction, player, interaction.options.getString('cmd'));
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
			if(interaction.options.getString('player')){
				try{
					const player = require(`../../../JSON/fichas/${interaction.options.getString('player').toLowerCase()}.json`)
					if(player.id != interaction.user.id){
						return interaction.channel.send({embeds:[messageEmbeds.noRole]})
							.then(() =>{
								setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
							}).catch((err) =>{
								console.log(err);
							});
					}
					home(interaction, player, interaction.options.getString('cmd'));
				}
				catch{
					messageEmbeds.error.description = `Esse personagem não existe!!`;
					pChannel.send({embeds: [messageEmbeds.error]})
					.then(() =>{
						setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
					}).catch((err) =>{
						console.log(err);
					});
				}
			}
			else{
				let filesList = fs.readdirSync("./JSON/fichas");filesList.shift();
				let player;
				for(let i in filesList){
					const file = require(`../../../JSON/fichas/${filesList[i]}`);
					if(interaction.user.id == file.id)
						player = file;
				}

				if(player){
					home(interaction, player, interaction.options.getString('cmd'));				
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
}
function home(interaction, player, cmd){
	const type = interaction.options.getString('type')?interaction.options.getString('type').toLowerCase():"null";
	switch(cmd.toLowerCase()){
		case 'add':
			addInventory(interaction, player, inventory[type], type);
			break;
		case 'show':
			showInventory(interaction, player, player.inventory[type], type);
			break;
		case 'rm':
			rmInventory(interaction, player);
			break;
		case 'edit':
			editInventory(interaction, player, player.inventory[type], type);
			break;
		default:
			const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
			messageEmbeds.msg.title = `Selecione o comando:`;
			messageEmbeds.msg.description = `Precisa me informar qual comando irá usar!`;
			messageEmbeds.msg.color = [0, 204, 255];
			pChannel.send({embeds: [messageEmbeds.msg], components:[cmds]})
				.then((msg) =>{
					const filter = b => b.user.id === interaction.user.id;
					pChannel.awaitMessageComponent({filter, max:1})
						.then((collect) =>{
							msg.delete();
							home(interaction, player, collect.customId);
						}).catch((err) =>{
							console.log(err);
						});
				}).catch((err) =>{
					console.log(err);
				});

	}
}
function addInventory(interaction, player, object, type){
	const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
	if(object){
		if(titles[Object.keys(object)[globalId]]){
			messageEmbeds.msg.title = `Digite ${titles[Object.keys(object)[globalId]]}:`;
			messageEmbeds.msg.description = `Precisa me informar ${titles[Object.keys(object)[globalId]]}!`;
			messageEmbeds.msg.color = [0, 204, 255];	
			pChannel.send({embeds: [messageEmbeds.msg]})
				.then((msg) =>{
					const filter = b => b.author.id === interaction.user.id;
					pChannel.awaitMessages({filter, max:1})
						.then((collect) =>{
							msg.delete();
							if(collect.first().content.toLowerCase() == 'cancel')
								return interaction.channel.send({content:'Exibição cancelada'})
										.then(() =>{
											setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
											interaction.channel.messages.cache.find(b => b.author.id === interaction.user.id).delete();
										});
							object[Object.keys(object)[globalId]] = collect.first().content.toLowerCase();
							if(Object.keys(object)[globalId] == 'maxAmmo')
								object['ammo'] = collect.first().content.toLowerCase();
							interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
							globalId++;
							Array.isArray(player.inventory[type])?player.inventory[type].push(object): player.inventory[type] = object.val;
							addInventory(interaction, player, object, type);
						}).catch((err) =>{
							console.log(err);
						});
				}).catch((err) =>{
					console.log(err);
				});
		}
		else{
			globalId = 0;
			saveDelete(interaction, embedInv(interaction, type, inventory[type], player), inventory[type], player, type);
		}
	}
	else{
		messageEmbeds.msg.title = `Selecione o tipo de item:`;
		messageEmbeds.msg.description = `Precisa me informar o tipo de item que irá adicionar!`;
		messageEmbeds.msg.color = [0, 204, 255];
		pChannel.send({embeds: [messageEmbeds.msg], components:[types]})
			.then((msg) =>{
				const filter = b => b.user.id === interaction.user.id;
				pChannel.awaitMessageComponent({filter, max:1})
					.then((collect) =>{
						msg.delete();
						addInventory(interaction, player, inventory[collect.customId], collect.customId);
					}).catch((err) =>{
						console.log(err);
					});
			}).catch((err) =>{
				console.log(err);
			});

	}
}
function showInventory(interaction, player, object, type){
	const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
	var item =	interaction.options.getString('item')?interaction.options.getString('item').toLowerCase():null;
	if(object){
		if(item){
			const pages = []
			if(type.toLowerCase() == 'coin'){
				for(let i in embedInv(interaction, 'coin', player.inventory['coin'], player))
					pages.push(embedInv(interaction, 'coin', player.inventory['coin'], player)[i]);
			}
			else{
				for(let i in player.inventory[type]){
					if(player.inventory[type][i].name == item.toLowerCase())
						pages.push(embedInv(interaction, type, player.inventory[type][i], player));
				}
			}
			if(pages.length != 0){
				pagInv(interaction, player, pages);
			}
			else{
				messageEmbeds.alert.description = `Esse item não é uma ${inventory[type].formatName}`;
					interaction.channel.send({embeds: [messageEmbeds.alert]})
						.then(() =>{
							setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
						});
			}
		}
		else{
			const pages = []
			if(type.toLowerCase() == 'coin'){
				for(let i in embedInv(interaction, 'coin', player.inventory['coin'], player))
					pages.push(embedInv(interaction, 'coin', player.inventory['coin'], player)[i]);
			}
			else{
				for(let i in object){
					pages.push(embedInv(interaction, type, object[i], player))
				}
			}
			pagInv(interaction, player, pages);
		}
	}
	else{
		if(item){
			const pages = []
			const types = ['gun', 'melle', 'bag'];
			for(let key in types){
				for(let i in player.inventory[types[key]]){
					if(player.inventory[types[key]][i].name == item.toLowerCase())
						pages.push(embedInv(interaction, types[key], player.inventory[types[key]][i], player));
				}
			}
			if(pages.length != 0){
				pagInv(interaction, player, pages);
			}
			else{
				messageEmbeds.alert.description = `Esse item não existe`;
					interaction.channel.send({embeds: [messageEmbeds.alert]})
						.then(() =>{
							setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
						});
			}
		}
		else{
			const pages = []
			for(let i in player.inventory.gun)
				pages.push(embedInv(interaction, 'gun', player.inventory.gun[i], player));
			for(let i in player.inventory.melle)
				pages.push(embedInv(interaction, 'melle', player.inventory.melle[i], player));
			for(let i in player.inventory.bag)
				pages.push(embedInv(interaction, 'bag', player.inventory.bag[i], player));
			for(let i in embedInv(interaction, 'coin', player.inventory['coin'], player))
				pages.push(embedInv(interaction, 'coin', player.inventory['coin'], player)[i]);
			pagInv(interaction, player, pages);
		}
	}
}
function editInventory(interaction, player, object, type){
	const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
	var item =	interaction.options.getString('item')?interaction.options.getString('item').toLowerCase():null;
	if(item){
		if(object){
			var select = null;
			for(let i in object){
				if(object[i].name == item.toLowerCase()){
					select = object[i];
				}
			}
			if(select){
				edit(interaction, select, player, type);
			}
			else{
				messageEmbeds.alert.description = `Esse item não é uma ${inventory[type].formatName}`;
				interaction.channel.send({embeds: [messageEmbeds.alert]})
					.then(() =>{
						setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
					});
			}
		}
		else{
			var select = null;
			var t = null;
			const types = ['gun', 'melle', 'bag'];
			for(let key in types){
				for(let i in player.inventory[types[key]]){
					if(player.inventory[types[key]][i].name == item.toLowerCase()){
						select = player.inventory[types[key]][i];
						t = types[key];
					}
				}
			}

			if(select){
				edit(interaction, select, player, t);
			}
			else{
				messageEmbeds.alert.description = `Esse item não existe`;
				interaction.channel.send({embeds: [messageEmbeds.alert]})
					.then(() =>{
						setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
					});
			}

		}
	}
	else{
		if(object){
			let listItens = {
				color: [0, 204, 255],
				fields:[]
			}
			for(let i in object){
				listItens.fields[i] = {
					name: `${parseInt(i)+1}: **${object[i].name.substr(0, 1).toUpperCase()+object[i].name.substr(1, object[i].name.length)}**`,
					value: object[i].formatName
				}
			}
			pChannel.send({embeds:[listItens], content: `Digite o número do item a editar`})
				.then((msg) =>{
					const filter = b => b.author.id === interaction.user.id;
					pChannel.awaitMessages({filter, max:1})
						.then((collect) =>{
							msg.delete()
							var index = collect.first().content;
							interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
							if(!isNaN(index))
								edit(interaction, object[parseInt(index)-1], player, type);
							else if(index.toLowerCase() == 'cancel')
								return interaction.channel.send({content:'Exibição cancelada'})
										.then(() =>{
											setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
											interaction.channel.messages.cache.find(b => b.author.id === interaction.user.id).delete();
										});
						}).catch((err) =>{
							console.log(err);
						});
				}).catch((err) =>{
					console.log(err);
				});
		}
		else{
			messageEmbeds.msg.title = `Selecione o tipo de item:`;
			messageEmbeds.msg.description = `Precisa me informar o tipo de item que irá editar!`;
			messageEmbeds.msg.color = [0, 204, 255];
			pChannel.send({embeds: [messageEmbeds.msg], components:[types]})
				.then((msg) =>{
					const filter = b => b.user.id === interaction.user.id;
					pChannel.awaitMessageComponent({filter, max:1})
						.then((collect) =>{
							msg.delete();
							editInventory(interaction, player, player.inventory[collect.customId], collect.customId);
						}).catch((err) =>{
							console.log(err);
						});
				}).catch((err) =>{
					console.log(err);
				});
		}
	}
}

function rmInventory(interaction, player){
	
}

function saveDelete(interaction, embed, object, player, type){
	const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
	pChannel.send({embeds: Array.isArray(embed)?embed:[embed], components: [Save_Edit_Delete]})
		.then((msg) =>{
			const filter = b => b.user.id === interaction.user.id;
			pChannel.awaitMessageComponent({filter, max:1})
				.then((collect) =>{
					msg.delete();
					if(collect.customId == 'save'){
						registerPlayer(interaction, player);
					}
					else if(collect.customId == 'del'){
						pChannel.send({content: `Voltando para a seleção de comando!!`, ephemeral: true})
							.then(() =>{
								setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
							});
						Array.isArray(object)?object.pop():object.val = '0';
						globalId = 0;
						home(interaction, player, "");
					}
					else if(collect.customId == 'edit'){
						edit(interaction, object, player, type);
					}
				}).catch((err) =>{
					console.log(err);
				});
		}).catch((err) =>{
			console.log(err);
		});
}
function edit(interaction, object, player, type){
	let editEmbed = {
		color: [0, 204, 255],
		fields:[]
	}
	let btn;
	if(object.hasOwnProperty('name')){
		editEmbed.fields[0] = {
			name: `**Nome**`,
			value: object.name.substr(0, 1).toUpperCase()+object.name.substr(1, object.name.length).toLowerCase()
		}
		if(object.hasOwnProperty('dmg')){
			editEmbed.fields[1] = {
				name: `**Dano**`,
				value: `D${object.dmg}`
			}
			if(object.hasOwnProperty('ammo')){
				editEmbed.title = "🔫 Arma de fogo 🔫";
				editEmbed.fields[2] = {
					name: `**Munição**`,
					value: `${object.ammo}/**${object.maxAmmo}**`
				}
				btn = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('name')
						.setLabel('Nome')
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('dmg')
						.setLabel('Dano')
						.setStyle('SUCCESS'),
					new MessageButton()
						.setCustomId('maxAmmo')
						.setLabel('Munição')
						.setStyle('PRIMARY')
				)
			}
			else{
				editEmbed.title = "⚔️ Arma Corpo-a-Corpo ⚔️";
				btn = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('name')
						.setLabel('Nome')
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('dmg')
						.setLabel('Dano')
						.setStyle('SUCCESS')
				);
			}
		}
		else if(object.hasOwnProperty('description')){
			btn = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('name')
					.setLabel('Nome')
					.setStyle('DANGER'),
				new MessageButton()
					.setCustomId('description')
					.setLabel('Descrição')
					.setStyle('SUCCESS')
			);
			editEmbed.title = "🎒 Mochila 🎒";
			editEmbed.fields[1] = {
				name: `**Descrição**`,
				value: object.description.substr(0, 1).toUpperCase()+object.description.substr(1, object.description.length).toLowerCase()
			}
		}
	}
	else{
			editEmbed.title = "💰 Moeda 💰";
			editEmbed.fields[0] = {
				name: `**Quantidade**`,
				value: `R$ ${object.val}`
			}
			btn = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('val')
					.setLabel('Quantidade')
					.setStyle('SECONDARY')
			);
		}
	const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
	pChannel.send({embeds: [editEmbed], components:[btn]})
		.then((msg) =>{
			const filter = b => b.user.id === interaction.user.id;
			pChannel.awaitMessageComponent({filter, max:1})
				.then((collect) =>{
					msg.delete();
					messageEmbeds.msg.color = [0, 204, 255];
					if(collect.customId == 'name'){
						messageEmbeds.msg.title = `NOME = ${object.name.toUpperCase()}`;
						messageEmbeds.msg.description = `Digite um novo nome para o item...`;
					}
					else if(collect.customId == 'description'){
						messageEmbeds.msg.title = `DESCRIÇÃO`;
						messageEmbeds.msg.description = `Digite uma nova descrição para o item...`;
					}
					else if(collect.customId == 'maxAmmo'){
						messageEmbeds.msg.title = `MUNIÇÃO = ${object.ammo}/${object.maxAmmo}`;
						messageEmbeds.msg.description = `Digite uma nova munição maxima para o item...`;
					}
					else if(collect.customId == 'val'){
						messageEmbeds.msg.title = `DINHEIRO = ${object.val}`;
						messageEmbeds.msg.description = `Digite uma nova quantidade de dinheiro para o personagem...`;
					}
					else if(collect.customId == 'dmg'){
						messageEmbeds.msg.title = `DANO = D${object.dmg}`;
						messageEmbeds.msg.description = `Digite um novo dano para o item...`;
					}
					const opt = collect.customId
					pChannel.send({embeds: [messageEmbeds.msg]})
						.then((msg) =>{
							const filter = b => b.author.id === interaction.user.id;
							pChannel.awaitMessages({filter, max:1})
								.then((collect) =>{
									msg.delete();
									object[opt] = collect.first().content.toLowerCase();
									if(opt == 'maxAmmo')
										object['ammo'] = collect.first().content.toLowerCase();
									interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
									saveDelete(interaction, embedInv(interaction, type, object, player), object, player, type)
								}).catch((err) =>{
									console.log(err);
								});
						}).catch((err) =>{
							console.log(err);
						});
				}).catch((err) =>{
					console.log(err);
				});
		}).catch((err) =>{
			console.log(err);
		});
}