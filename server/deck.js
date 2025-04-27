require('dotenv'.config();
const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function deck_upsertCard(user_id, txt_front, txt_back){
	try {
		await client.connect();
		const db = client.db('lovelang');
		const users = db.collection('users');
		
		const updateResult = await users.updateOne(
			{ _id: new ObjectId(user_id),"deck.txt_front": txt_front},
			{ $set: { "deck.$.txt_back": txt_back } }
		);

		if (updateResult.matchedCount == 0) {
			const pushResult = await users.updateOne(
				{ _id: new ObjectId(user_id) },
				{ $push: { deck: {txt_front, txt_back } } }
			);
			console.log('New card inserted');
		} else {
			console.log('Existing card updated');
		}
	} catch(error) {
		console.error('Error in deck_upsertCard:', error);
	} finally {
		await client.close();
	}
}

deck_upsertCard(process.argv[2], process.argv[3], process.argv[4]).catch(console.dir)
