import db from "./connect.js";

const createCard = async (cardData) => {

	if (!!cardData.listInMarketplace) await db.collection('marketplace').insertOne({id: cardData.id, price: cardData.price});
	delete cardData.listInMarketplace;

	const result = await db.collection('cards').insertOne(cardData);
	return result.insertedId;

};

const getCard = async (cardId) => {
	return await db.collection('card').findOne({id: cardId})
}

const getCardFromMarketplace = async (cardId) => {
	return await db.collection('marketplace').findOne({id: cardId})
}


export { createCard, getCard, getCardFromMarketplace };
