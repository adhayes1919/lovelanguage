export async function couple_findMatch(db, userA_id, searchMatchCode) {
    try {
        const users = db.collection('users');
        const partnerships = db.collection('partnerships');

        const userA = await users.findOne({ _id: new ObjectId(userA_id) });
        if (!userA) {
            console.log('User A not found.');
            return { success: false, message: 'User not found.' };
        }

        // Attempt to find and lock User B (must be not in partnership yet)
        const updateResult = await users.updateOne(
            { matchCode: searchMatchCode, inPartnership: false },
            { $set: { inPartnership: true } }
        );

        if (updateResult.matchedCount === 0) {
            console.log('No available user found with that match code.');
            return { success: false, message: 'Invalid or already taken match code.' };
        }

        // Fetch User B after update
        const userB = await users.findOne({ matchCode: searchMatchCode });
        if (!userB) {
            console.log('Unexpected: userB updated but not found.');
            return { success: false, message: 'Partner lookup failed.' };
        }

        // Create partnership document
        await partnerships.insertOne({
            user1_id: userA._id,
            user2_id: userB._id,
            createdAt: new Date(),
        });

        // Mark User A as in a partnership too
        await users.updateOne(
            { _id: userA._id },
            { $set: { inPartnership: true } }
        );

        console.log('Partnership successfully created!');
        return { success: true };
    } catch (error) {
        console.error('Error creating partnership: ', error);
        return { success: false, message: 'Server error' };
    }
}


