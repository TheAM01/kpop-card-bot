import {REST, Routes} from "discord.js";
import fs from "fs";
import path from "path";
import "dotenv/config"

const {clientId, guildId, TOKEN} = process.env;

const commands = [];
const __dirname = path.resolve();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {

		const filePath = path.join(commandsPath, file);
		const cmd = await import("file:///"+filePath);
		const command = cmd.default;

		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}

	}
}

const rest = new REST().setToken(TOKEN);


try {
	console.log(`Started registering ${commands.length} application (/) commands.`);

	// The put method is used to fully refresh all commands in the guild with the current set
	const data = await rest.put(
		Routes.applicationGuildCommands(clientId, guildId),
		{ body: commands },
	);

	console.log(`Successfully registered ${data.length} application (/) commands.`);
} catch (error) {
	console.error(error);
}
