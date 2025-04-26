const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://10.135.168.95:27017';
const client = new MongoClient(uri);

async function addPoints(user_id, count) {
	try {
		await client.connect();
		const db = client.db('lovelang');
		const users = db.collection('users');

		const updateResult = await users.updateOne(
			{ _id: new ObjectId(user_id) },
			{ $inc: { score: +count } }
		);

		if (updateResult.matchedCount === 0) {
			console.log('No user found with the given ID');
		} else {
			console.log('User score incremented successfully');
		}
	} catch (error) {
		console.error('Error incrementing score: ', error);
	}
}

async function incrementStreak(user_id) {
	try {
		await client.connect();
		const db = client.db('lovelang');
		const users = db.collection('users');

		const updateResult = await users.updateOne(
			{ _id: new ObjectId(user_id) },
			{ $inc: { streak: 1 } }
		);

		if (updateResult.matchedCount === 0) {
			console.log('No user found with the given ID');
		} else {
			console.log('User streak incremented successfully');
		}
	} catch (error) {
		console.error('Error incrementing streak: ', error);
	}
}

async function main() {
	await addPoints(process.argv[2], process.argv[3]);
	await incrementStreak(process.argv[2]);
	await client.close();
}

main().catch(console.dir);