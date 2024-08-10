import {addUserCard, getUser, updateUserCurrency} from "../../database/user-model.js";
import {logTransaction} from "../../database/transaction-model.js";
import {SlashCommandBuilder} from "discord.js";
import {getCardFromMarketplace} from "../../database/card-model.js";


export default {
	data: new SlashCommandBuilder()
		.setName('buy-card')
		.setDescription('Buy a card from the marketplace.')
		.addStringOption(option => option
			.setName('card-id')
			.setDescription('The ID of the card you want to buy!')
			.setRequired(true)),

	async execute(interaction) {

		await interaction.deferReply();

		const cardId = interaction.options.getString('card-id');
		const user = await getUser(interaction.user.id);
		const card = await getCardFromMarketplace(cardId);

		if (user.balance < card.price)
			return await interaction.editReply('Insufficient funds!');

		await updateUserCurrency(interaction.user.id, -card.price);
		await addUserCard(interaction.user.id, cardId);
		await logTransaction({ userId: interaction.user.id, cardId, price: card.price, date: new Date() });

		await interaction.editReply('Card purchased successfully!');

	}
};