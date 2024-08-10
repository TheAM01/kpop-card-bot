import {Client, Collection, GatewayIntentBits as Intents, PresenceUpdateStatus} from "discord.js";
import path from "path";
import fs from "fs";

const client = new Client(
	{
		intents: [
			Intents.Guilds,
			Intents.GuildMessages,
			Intents.MessageContent
		]
	}
);


// const blocked = JSON.parse(fs.readFileSync("block-list.json"));
// client.blockList = blocked;
// if (!blocked[0]) client.blockList = [];
//
// const channel = JSON.parse(fs.readFileSync("channel.json"));
// client.setupChannels = {};
// client.setupChannels.webhook = channel.webhook;


client.commands = new Collection();
const __dirname = path.resolve()
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const cmd = await import("file:///"+filePath);
		const command = cmd.default;
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


export default client;