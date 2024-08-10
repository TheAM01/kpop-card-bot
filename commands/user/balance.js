import {getUser, User} from "../../database/user-model.js";
import {SlashCommandBuilder} from "discord.js";


export default {

	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Check your balance.'),

	async execute(interaction) {

		await interaction.deferReply();

		const user = await getUser(interaction.user.id);

		if (!user)
			return await interaction.editReply("You don't have an account yet. Create one by doing `/register`.");

		return await interaction.editReply(`Your balance: ${user.balance || "`You find a cool bug`"} coins`);

	}

};
