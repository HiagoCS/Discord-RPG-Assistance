const Event = require('../../structures/Event');
const fs = require('fs');

module.exports = class extends Event{
	constructor(client){
		super(client, {
			name: 'ready'
		})
	}
	run = () =>{
		console.log(`${this.client.user.username} está pronto pra executar Plebs com Prime :)`)
		this.client.registryCommands();
		const filesList = fs.readdirSync("./JSON");
		if(!filesList.includes('fichas')){
			fs.mkdirSync("./JSON/fichas");
		}
	}
}