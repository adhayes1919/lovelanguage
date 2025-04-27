import { ObjectId } from 'mongodb';

// Add points to a user's score
export async function addPoints(db, user_id, count) {
	try {
		const users = db.collection('users');

		const updateResult = await users.updateOne(
			{ _id: new ObjectId(user_id) },
			{ $inc: { score: +count } }
		);

		if (updateResult.matchedCount === 0) {
			console.log('No user found with the given ID');
			return false;
		} else {
			console.log('User score incremented successfully');
			return true;
		}
	} catch (error) {
		console.error('Error incrementing score:', error);
		return false;
	}
}

// Increment a user's streak
export async function incrementStreak(db, user_id) {
	try {
		const users = db.collection('users');

		const updateResult = await users.updateOne(
			{ _id: new ObjectId(user_id) },
			{ $inc: { streak: 1 } }
		);

		if (updateResult.matchedCount === 0) {
			console.log('No user found with the given ID');
			return false;
		} else {
			console.log('User streak incremented successfully');
			return true;
		}
	} catch (error) {
		console.error('Error incrementing streak:', error);
		return false;
	}
}

// Get leaderboard based on mode: 0 = score, 1 = streak
export async function getLeaderboard(db, mode, limit = 10) {
	try {
		const partnerships = db.collection('partnerships');

		let pipeline;

		if (mode == 0) { // Score-based leaderboard
			pipeline = [
				{
					$lookup: {
						from: 'users',
						localField: 'user1_id',
						foreignField: '_id',
						as: 'user1'
					}
				},
				{
					$lookup: {
						from: 'users',
						localField: 'user2_id',
						foreignField: '_id',
						as: 'user2'
					}
				},
				{
					$project: {
						user1_name: { $arrayElemAt: ["$user1.username", 0] },
						user1_score: { $arrayElemAt: ["$user1.score", 0] },
						user2_name: { $arrayElemAt: ["$user2.username", 0] },
						user2_score: { $arrayElemAt: ["$user2.score", 0] }
					}
				},
				{
					$addFields: {
						partnership_score: { $add: ["$user1_score", "$user2_score"] }
					}
				},
				{
					$sort: { partnership_score: -1 }
				},
				{
					$limit: limit
				}
			];
		} else if (mode == 1) { // Streak-based leaderboard
			pipeline = [
				{
					$lookup: {
						from: 'users',
						localField: 'user1_id',
						foreignField: '_id',
						as: 'user1'
					}
				},
				{
					$lookup: {
						from: 'users',
						localField: 'user2_id',
						foreignField: '_id',
						as: 'user2'
					}
				},
				{
					$project: {
						user1_name: { $arrayElemAt: ["$user1.username", 0] },
						user1_streak: { $arrayElemAt: ["$user1.streak", 0] },
						user2_name: { $arrayElemAt: ["$user2.username", 0] },
						user2_streak: { $arrayElemAt: ["$user2.streak", 0] }
					}
				},
				{
					$addFields: {
						partnership_score: { $min: ["$user1_streak", "$user2_streak"] }
					}
				},
				{
					$sort: { partnership_score: -1 }
				},
				{
					$limit: limit
				}
			];
		} else {
			throw new Error('Invalid leaderboard mode');
		}

		const result = await partnerships.aggregate(pipeline).toArray();
		return result;
	} catch (error) {
		console.error('Error getting leaderboard:', error);
		return [];
	}
}
