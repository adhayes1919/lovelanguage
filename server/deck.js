export async function deck_upsertCardBack(db, user_id, txt_front, txt_back){
	try {
		const users = db.collection('users');
		
		const updateResult = await users.updateOne(
			{ _id: new ObjectId(user_id), "deck.txt_front": txt_front},
			{ $set: { "deck.$.txt_back": txt_back } }
		);

		if (updateResult.matchedCount == 0) {
			const pushResult = await users.updateOne(
				{ _id: new ObjectId(user_id) },
				{ $push: { deck: {txt_front, txt_back, ease: 0, image: null, audio: null} } }
			);
			console.log('New card inserted');
		} else {
			console.log('Existing card updated');
		}
	} catch(error) {
		console.error('Error in deck_upsertCard:', error);
	}
}

export async function deck_updateCardEase(db, user_id, txt_front, score) {
	try {
		const users = db.collection('users');
		const updateResult = await users.updateOne(
			{ _id: new ObjectId(user_id), "deck.txt_front": txt_front},
			{ $set: { "deck.$.ease": score} }
		);

		if (updateResult.matchedCount == 0) {
			console.log('No matching card found');
		} else {
			console.log('Card successfully updated');
		}
	} catch (error) {
		console.error('Error updating card ease score: ', error);
	}
}

export async function deck_requestCard(db, userA_id, txt_request){
	try {
		const users = db.collection('users');
		const partnerships = db.collection('partnerships');
		const requests = db.collection('requests');
		
		const userAObjectId = new ObjectId(userA_id);

		// get a reference to the requesting user
		const userA = await users.findOne({ _id: userAObjectId });
		if (!userA) {
			console.log('User making request not found');
			return;
		}

		// find the partnership the user is in
		const partnership = await partnerships.findOne({
			$or: [
				{ user1_id: userAObjectId },
				{ user2_id: userAObjectId }
			]
		});

		if (!partnership) {
			console.log('No partnership found for this user.');
			return;
		}
	
		// Determine the partner's ID
		const partnerId = partnership.user1_id.equals(userAObjectId)
			? partnership.user2_id
			: partnership.user1_id;

		// create a request for the given users with the indicated text
		await requests.insertOne({
			sender_id: userA._id,
			recipient_id: partnerId,
			txt_request
		});
	} catch (error) {
		console.error('Error making request:', error);
	}
}

export async function deck_getRequestsReceived(db, user_id) {
	try {
		const requests = db.collection('requests');

		const requestsReceived = await requests.find({ recipient_id: new ObjectId(user_id) }).toArray();

		return requestsReceived;
	} catch (error) {
		console.log('Error showing requests received: ', error);
	}
}

export async function deck_getFullDeck(db, user_id) {
	try {
		const users = db.collection('users');

		const userFound = await users.findOne({'_id': new ObjectId(user_id)});

		if (userFound) {
			return userFound.deck;
		} else {
			console.log("No matching user found");
			return;
		}

	} catch  (error) {
		console.log('Error getting deck: ', error);
	}
}

export async function deck_getCardInfo(db, user_id, txt_front) {
	try {
		const users = db.collection('users');

		const userFound = await users.findOne(
			{
				'_id': new ObjectId(user_id),
				"deck.txt_front": txt_front
			},
			{
				projection: {
					"deck.$": 1
				}
			}
		);

		if (userFound && userFound.deck.length > 0) {
			return userFound.deck[0];
		} else {
			console.log("No matching card found");
			return;
		}

	} catch  (error) {
		console.log('Error finding card: ', error);
	}
}

/*
export async function main() {
	// await deck_requestCard(process.argv[2], process.argv[3]);
	// await deck_upsertCardBack(process.argv[2], process.argv[3], process.argv[4]).catch(console.dir)
	// const requests = await deck_getRequestsReceived(process.argv[2]);
	// console.log(requests);
	await deck_updateCardEase(process.argv[2],process.argv[3],+process.argv[4]);
	const deck = await deck_getFullDeck(process.argv[2]);
	console.log(deck);
	console.log(await deck_getCardInfo(process.argv[2],process.argv[3]));
}


main().catch(console.dir);
*/
