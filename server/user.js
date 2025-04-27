require('dotenv'.config());
const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function user_getDetails(db, user_id) {
    try {
        const users = db.collection('users');

        const result = db.findOne({ _id : new ObjectId(user_id)});

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