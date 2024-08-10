import db from "./connect.js";

const logTransaction = async (transactionData) => {
	return await db.collection('transactions')
		.insertOne(transactionData);
};

export { logTransaction };
