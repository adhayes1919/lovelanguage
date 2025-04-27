//import {ObjectId} from 'mongodb';


export async function couple_findMatch(db, userA_id, searchMatchCode){
	// create a partnership entry that records both members and other details
	try{
		const users = db.collection('users');
		const partnerships = db.collection('partnerships');

		const userA = await users.findOne({ _id: new ObjectId(userA_id) });
		if (!userA) {
			console.log('User A not found.');
			return;
		}

		// Try to lock userB by setting inPartnership: true if free
		const updateResult = await users.updateOne(
			{ matchCode: searchMatchCode, inPartnership: false },
			{ $set: { inPartnership: true } }
		);

		if (updateResult.matchedCount === 0) {
			console.log('No available user found with that match code.');
			return;
		}

		// Now fetch userB
		const userB = await users.findOne({ matchCode: searchMatchCode });
		if (!userB) {
			console.log('Unexpected: user updated but not found');
			return;
		}

		await partnerships.insertOne({
			user1_id: userA._id,
			user2_id: userB._id,
			createdAt:new Date()
		})

		//also update userA
		await users.updateOne(
			{ _id: userA._id },
			{ $set: { inPartnership: true } }
		);

		console.log('Partnership created');
	} catch (error) {
		console.error('Error creating partnership:  ', error);	
	} 
}

//couple_findMatch(process.argv[2], process.argv[3]).catch(console.dir);
