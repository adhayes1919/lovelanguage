const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://10.135.168.95:27017';
const client = new MongoClient(uri);

async function getLeaderboard(mode, limit=10) {
    try {
        await client.connect;
        const db = client.db('lovelang');
		const users = db.collection('users');
		const partnerships = db.collection('partnerships');

        let pipeline;

        if (mode == 0) { // score-based leaderboard
            pipeline= [
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
                    $addFields:  {
                        partnership_score: { $add: ["$user1_score", "$user2_score"] }
                    }
                },
                {
                    $sort: {partnership_score: -1 }
                },
                {
                    $limit: limit
                }
            ]
        } else if (mode == 1) { // streak-based leaderboard
            pipeline= [
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
                    $addFields:  {
                        partnership_score: { $min: ["$user1_streak", "$user2_streak"] }
                    }
                },
                {
                    $sort: {partnership_score: -1 }
                },
                {
                    $limit: limit
                }
            ]
        }

        const result = await partnerships.aggregate(pipeline).toArray();
        return result;
    } catch (error) {
        console.error('Error getting leaderboard: ', error);
    }
}

async function main() {
    const leaderboard = await getLeaderboard(process.argv[2]);
    console.log(leaderboard);
    await client.close();
}

main().catch(console.dir);