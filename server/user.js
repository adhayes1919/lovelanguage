import {ObjectId} from 'mongodb';

export async function user_getDetails(db, user_id) {
    try {
        const users = db.collection('users');

        const result = await users.findOne({ _id : new ObjectId(user_id)});

        console.log(`raw result: ${result}`);
        if (result) {
            console.log("Successfully got user details");
            return result;
        } else {
            console.log("No user found with that id");
            return;
        }
    } catch (error) {
        console.error("Error getting user details:  ", error);
    }
}

// gets the partner that the specified user is in a partnership with if one exists
export async function user_getPartner(db, user_id) {
	try{
		const users = db.collection('users');
		const partnerships = db.collection('partnerships');

		const userObjectId = new ObjectId(user_id)

		const user = await users.findOne({ _id: userObjectId });

		if (!user) {
			console.log("Couldn't find user");
			return;
		} else if (user.inPartnership == false) {
			console.log("User not in partnership");
			return;
		}else {
			const partnership = await partnerships.findOne({
				$or: [
					{ user1_id: userObjectId },
					{ user2_id: userObjectId }
				]
			});
	
			if (!partnership) {
				console.log('No partnership found for this user.');
				return null;
			}
	
			// Determine the partner's ID
			const partnerId = partnership.user1_id.equals(userObjectId)
				? partnership.user2_id
				: partnership.user1_id;
			
			// Get the partner's details
			const partnerDetails = await user_getDetails(db, partnerId);

			if (partnerDetails) {
				return partnerDetails;
			} else {
				console.log("No partner details found");
				return { error: "No partner details found" };
			}
		}
	} catch (error) {
		console.error('Error getting partner: ', error);
	}
}
