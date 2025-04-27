import bcrypt from 'bcrypt';

async function generateMatchCode(length = 5) {
	return Math.random().toString(36).substring(2, 2+ length).toUpperCase();
}

export default async function registerUser(db, username, password, confirmPassword, name, language) {
	try {
		const users = db.collection('users');
		
		// check if username already exists
		const userWithName = await users.findOne({username});
		if (userWithName) {
			console.log('User with this name already exists');
			return -1;
		}

        if (password !== confirmPassword) {
			console.log('Passwords do not match');
            return -2;
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
			password: hashedPassword,
            name,
			matchCode,
			pfpNum: 0, // number corresponding to one of the preset profile pictures
			streak: 0,
			score: 0,
			language,
			inPartnership: false,
			deck: [],
			createdAt:  new Date()
		});
        return {
            success: true,
            userId: result.insertedId,
            matchCode
        };
		console.log('User registered: ', result.insertedID);
	} catch (error) {	
		console.error('Error registering user: ', error);
	} 
}

registerUser(process.argv[2], process.argv[3], process.argv[4]).catch(console.dir)
