//Discord events
const Command = require('../../structures/Command');
const botconfig = require('../../../JSON/botconfig.json');
const listsEmbeds = require('../../../JSON/embeds/list.json');
const messageEmbeds = require('../../../JSON/embeds/messages.json');
const types = require('../../modulesExports/buttons/inventoryTypes.js');
const cmds = require('../../modulesExports/buttons/inventoryCmds.js');
const pagInv = require('../../modulesExports/functions/paginationInventory.js');
const embedGun = require('../../modulesExports/functions/embedGun.js');
const Save_Edit_Delete = require('../../modulesExports/buttons/save_edit_delete.js');
const registerPlayer = require('../../modulesExports/functions/registerPlayer.js')

var globalId = 0;
var gun = {
	'name':'',
	'dmg':'',
	'ammo':'',
	'maxAmmo':''
}
var melle = {
	'name':'',
	'dmg':''
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

			}
		}
	}
}
function home(interaction, player, cmd){
	switch(cmd.toLowerCase()){
		case 'add':
			addInventory(interaction, player, interaction.options.getString('type'));
			break;
		case 'show':
			showInventory(interaction, player);
			break;
		case 'rm':
			rmInventory(interaction, player);
			break;
		case 'edit':
			editInventory(interaction, player);
			break;
		default:
			messageEmbeds.msg.title = `Selecione o comando:`;
			messageEmbeds.msg.description = `Precisa me informar qual comando irá usar!`;
			messageEmbeds.msg.color = [0, 204, 255];
			pChannel.send({embeds: [messageEmbeds.msg], components:[cmds]})
				.then((msg) =>{
					const filter = b => b.user.id === interaction.user.id;
					pChannel.awaitMessageComponent({filter, max:1})
						.then((collect) =>{
							home(interaction, player, collect.customId);
						}).catch((err) =>{
							console.log(err);
						});
				}).catch((err) =>{
					console.log(err);
				});

	}
}
function addInventory(interaction, player, type){
	const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
	if(type){
		if(type.toLowerCase() == 'gun'){
			messageEmbeds.msg.title = `Digite o nome:`;
			messageEmbeds.msg.description = `Precisa me informar o nome da sua arma!`;
			messageEmbeds.msg.color = [0, 204, 255];
			pChannel.send({embeds: [messageEmbeds.msg]})
				.then((msg) =>{
					const filter = b => b.author.id === interaction.user.id;
					pChannel.awaitMessages({filter, max:1})
						.then((collect) =>{
							msg.delete();
							gun.name = collect.first().content.toLowerCase();
							interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
							messageEmbeds.msg.title = `Digite o dano:`;
							messageEmbeds.msg.description = `Precisa me informar o dano da sua arma!\nExemplo: Se o dano for 1D7 digite apenas "7".`;
							messageEmbeds.msg.color = [0, 204, 255];
							pChannel.send({embeds: [messageEmbeds.msg]})
								.then((msg) =>{
									const filter = b => b.author.id === interaction.user.id;
									pChannel.awaitMessages({filter, max:1})
										.then((collect) =>{
											msg.delete();
											gun.dmg = collect.first().content.toLowerCase();
											interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
											messageEmbeds.msg.title = `Digite a munição:`;
											messageEmbeds.msg.description = `Precisa me informar a munição da sua arma!\n**Digite apenas o número de munições soltas**.`;
											messageEmbeds.msg.color = [0, 204, 255];
											pChannel.send({embeds: [messageEmbeds.msg]})
												.then((msg) =>{
													const filter = b => b.author.id === interaction.user.id;
													pChannel.awaitMessages({filter, max:1})
														.then((collect) =>{
															msg.delete();
															gun.ammo = collect.first().content.toLowerCase();
															gun.maxAmmo = collect.first().content.toLowerCase();
															interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id).messages.cache.find(b => b.author.id === interaction.user.id).delete();
															player.inventory.gun.push(gun);
															saveDelete(interaction, embedGun(interaction, gun), type, player);
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
						}).catch((err) =>{
							console.log(err);
						});
				}).catch((err) =>{
					console.log(err);
				});
		}
		else if(type.toLowerCase() == 'melle'){
			console.log("MELLE");
		}
		else if(type.toLowerCase() == 'coin'){
			console.log("COIN");
		}
		else if(type.toLowerCase() == 'bag'){
			console.log("BAG");
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
						addInventory(interaction, player, collect.customId);
					}).catch((err) =>{
						console.log(err);
					});
			}).catch((err) =>{
				console.log(err);
			});

	}
}
function showInventory(interaction, player){
	
}
function rmInventory(interaction, player){
	
}
function editInventory(interaction, player){
	
}

function saveDelete(interaction, embed, option, player){
	const pChannel = interaction.guild.channels.cache.find(c => c.id === player.privateChannel.id);
	pChannel.send({embeds: [embed], components: [Save_Edit_Delete]})
		.then((msg) =>{
			const filter = b => b.user.id === interaction.user.id;
			pChannel.awaitMessageComponent({filter, max:1})
				.then((collect) =>{
					msg.delete();
					if(collect.customId == 'save'){
						registerPlayer(interaction, player);
					}
					else if(collect.customId == 'del'){
						pChannel.send({content: `Reiniciando ${option.substr(0, 1)+option.substr(1, option.length)}`, ephemeral: true})
							.then(() =>{
								setTimeout(() => interaction.channel.messages.cache.find(b => b.author.bot === true).delete(), 5000);
							});
						if(option == 'gun'){
							player.inventory.gun.pop();
						}
						else if(option == 'melle'){
							player.inventory.melle.pop();
						}
						else if(option == 'bag'){
							player.inventory.bag.pop();
						}
						else{
							player.inventory.coin = "0";
						}
						globalId = 0;
						home(interaction, player, option);
					}
					else if(collect.customId == 'edit'){
						
					}
				}).catch((err) =>{
					console.log(err);
				});
		}).catch((err) =>{
			console.log(err);
		});
}
function edit(interaction, object, embed){
	
}