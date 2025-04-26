const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = 'mongodb://10.135.168.95:27017';
const client = new MongoClient(uri);

async function generateMatchCode(length = 5) {
	return Math.random().toString(36).substring(2, 2+ length).toUpperCase();
}

async function registerUser(username, email, password, language) {
	try {
		await client.connect();
		const db = client.db('lovelang');
		const users = db.collection('users');
		
		// check if username already exists
		const userWithName = await users.findOne({username});
		if (userWithName) {
			console.log('User with this name already exists');
			return -1;
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		
		let matchCode;
		let isUnique = false;

		while (!isUnique) {
			matchCode = await generateMatchCode();
			const userWithCode = await users.findOne({matchCode});

			if (!userWithCode) {
				isUnique = true;
			}
		}

		const result = await users.insertOne({
			username,
			email,
			password: hashedPassword,
			matchCode,
			pfpNum: 0, // number corresponding to one of the preset profile pictures
			streak: 0,
			score: 0,
			language,
			inPartnership: false,
			deck: [],
			createdAt:  new Date()
		});

		console.log('User registered: ', result.insertedID);
	} catch (error) {	
		console.error('Error registering user: ', error);
	} finally {
		await client.close();
	}
}

registerUser(process.argv[2], process.argv[3], process.argv[4]).catch(console.dir)
