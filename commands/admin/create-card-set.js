import {createCard} from "../../database/card-model.js";
import {EmbedBuilder, SlashCommandBuilder} from "discord.js";

export default {
	data: new SlashCommandBuilder()

		.setName('create-card')

		.setDescription('Create a card.')

		.addStringOption(option => option
			.setName("card-id")
			.setDescription("The ID of the card you want to create. Run /help create-card to see good id naming practices.")
			.setRequired(true))

		.addStringOption(option => option
			.setName('name')
			.setDescription('The name of the card')
			.setRequired(true))

		.addStringOption(option => option
			.setName('description')
			.setDescription('The name of the card')
			.setRequired(true))

		.addStringOption(option => option
			.setName('rarity')
			.setDescription('The rarity of the card')
			.setRequired(true)
			.addChoices(
				{name: 'Common', value: '1'},
				{name: 'Basic', value: '2'},
				{name: 'Rare', value: '3'},
				{name: 'Legendary', value: '4'}
			)
			.setRequired(true))

		.addNumberOption(option => option
			.setName('price')
			.setDescription('The price of the card')
			.setRequired(true))

		.addStringOption(option => option
			.setName('thumbnail')
			.setDescription('The absolute URL of the thumbnail image')
			.setRequired(true))

		.addNumberOption(option => option
			.setName('copies')
			.setDescription('The allowed amount number of copies of this card')
			.setRequired(true))

		.addStringOption(option => option
			.setName('set')
			.setDescription('The set the card belongs to.'))

		.addBooleanOption(option => option
			.setName('list-in-marketplace')
			.setDescription('If you want the card to be listed in the marketplace (defaults to yes).')),

	async execute(interaction) {
		await interaction.deferReply();

		const id = interaction.options.getString('card-id');
		const name = interaction.options.getString('name');
		const description = interaction.options.getString('description');
		const rarity = parseInt(interaction.options.getString('rarity'));
		const price = interaction.options.getNumber('price');
		const thumbnail = interaction.options.getString('thumbnail');
		const copies = parseInt(interaction.options.getNumber('copies'));
		const set = interaction.options.getString('set');
		const listInMarketplace = interaction.options.getBoolean('list-in-marketplace') || true;
		const releaseDate = (new Date()).toString();

		if (!isValidURL(thumbnail))
			return await interaction.editReply(`\`${thumbnail}\` is not a valid image URL. Press \`Up Arrow Key\` to re-run the command.`);

		const card = {
			id,
			name,
			description: description || "",
			rarity,
			price,
			copies,
			thumbnail,
			set: set || "",
			releaseDate,
			listInMarketplace
		};

		await createCard(card);

		let rarities = {
			"1": {name: "Common", color: 0xFFFFFF},
			"2": {name: "Basic", color: 0x358B09},
			"3": {name: "Rare", color: 0xF3B328},
			"4": {name: "Legendary", color: 0xC900C6}
		}

		const embed = new EmbedBuilder()
			.setTitle(name)
			.setAuthor({name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL()})
			.setDescription(description)
			.setColor(rarities[rarity].color)
			.addFields(
				{name: "Rarity", value: rarities[rarity].name},
				{name: "Price", value: `${price} coins`},
				{name: "Set", value: set || "none"},
				{name: "Release date", value: releaseDate},
				{name: "Allowed copies", value: copies.toString()},
				{name: "Available in marketplace", value: `${listInMarketplace ? "Yes" : "No"}`}
			)
			.setImage(thumbnail)
			.setTimestamp()

		return await interaction.editReply({embeds: [embed], content: "Successfully created this card!"})
	}
};

function isValidURL(string) {
	const urlPattern = new RegExp(
		'^(https?:\\/\\/)?' + // Protocol (http or https)
		'((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // Domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IPv4 address
		'(\\:\\d+)?' + // Optional port
		'(\\/[-a-zA-Z\\d%_.~+]*)*' + // Path
		'(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // Query string
		'(\\#[-a-zA-Z\\d_]*)?$', // Fragment locator
		'i' // Case-insensitive flag
	);

	return !!urlPattern.test(string);
}