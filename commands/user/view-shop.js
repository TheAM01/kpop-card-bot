import db from "../../database/connect.js";
import {SlashCommandBuilder} from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("view-shop")
		.setDescription('View the marketplace.'),

	async execute(interaction) {

		await interaction.deferReply();

		const listings = await db.collection('marketplace').find().toArray();
		const formattedListings = listings.map((listing, i) => `${i+1}. ${listing.id}: ${listing.price} coins`).join('\n');

		await interaction.editReply(`Marketplace listings:\n${formattedListings[0]? formattedListings : "`None yet!`"}`);

	}
};