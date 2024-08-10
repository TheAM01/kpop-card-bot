import {getUser, User} from "../../database/user-model.js";
import {SlashCommandBuilder} from "discord.js";


export default {

	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Register your account.'),

	async execute(interaction) {

		await interaction.deferReply();

		const existing = await getUser(interaction.user.id);

		if (!!existing)
			return await interaction.editReply("You already have an account!");

		const user = new User(interaction.user.id);

		await user.register();

		return await interaction.editReply('Successfully created your account!');

	}

};
