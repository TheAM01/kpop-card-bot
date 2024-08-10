import db from "../../database/connect.js";
import {SlashCommandBuilder} from "discord.js";
import {getUser} from "../../database/user-model.js";

export default {
	data: new SlashCommandBuilder()
		.setName('list-card')
		.setDescription('List a card for sale in the marketplace.')
		.addStringOption(option => option
			.setName('card-id')
			.setDescription('The ID of the card you want to sell.')
			.setRequired(true))
		.addNumberOption(option => option
			.setName('price')
			.setDescription('The price you want to list it for.')
			.setRequired(true)),

	async execute(interaction) {
		await interaction.deferReply();

		const cardId = interaction.options.getString('card-id');
		const price = interaction.options.getNumber('price');

		const user = await getUser(interaction.user.id);
		const userCards = user.cards;

		if (!user.card.includes(card => card.id === cardId))
			return await interaction.editReply('You don\'t have this card in your inventory.');

		await db.collection('marketplace').insertOne({
			cardId,
			price: parseInt(price),
			sellerId: interaction.user.id
		});

		await interaction.editReply('Card listed for sale!');
	}
};