import db from "./connect.js";


const getUser = async (userId) => {
	return await db.collection('users')
		.findOne({ id: userId });
};

const updateUser = async (userId, updateData) => {
	return await db.collection('users')
		.updateOne({ userId }, { $set: updateData }, { upsert: true });
};

const updateUserCurrency = async (userId, amount) => {
	return await db.collection('users')
		.updateOne({ userId }, { $inc: { balance: amount } }, { upsert: true });
};

const addUserCard = async (userId, cardId) => {
	return await db.collection('users').updateOne(
		{ userId },
		{ $addToSet: { cards: cardId } },
		{ upsert: true }
	);
};

class User {

	constructor(userId) {
		this.id = userId;
		this.balance = 500;
		this.cards = [];
		this.createdAt = Date.now();
		this.isPremium = false;
	}

	async register() {

		const existing = await getUser(this.id);
		if (!!existing) throw "User already exists!";

		return await db.collection("users")
			.insertOne(this);

	}

}

export { User, getUser, updateUser, updateUserCurrency, addUserCard };
