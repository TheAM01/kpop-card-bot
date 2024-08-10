import {getUser} from "../../database/user-model.js";
import {SlashCommandBuilder} from "discord.js";


export default {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('View all your cards'),

	async execute(interaction) {
		await interaction.deferReply();
		const user = await getUser(interaction.user.id);
		await interaction.editReply(`Your cards:\n${user.cards[0]? user.cards.join(', ') : "`None yet!`"}`);
	}
};