import bcrypt from 'bcrypt';

// Helper: generate a random match code
async function generateMatchCode(length = 5) {
	return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

// Login user
export async function loginUser(db, username, password) {
	try {
		const users = db.collection('users');

		const user = await users.findOne({ username });
		if (!user) {
			console.log('User not found');
			return false;
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (isMatch) {
			console.log('Login successful!');
			return true;
		} else {
			console.log('Incorrect password.');
			return false;
		}
	} catch (error) {
		console.error('Error logging in:', error);
		return false;
	}
}

// Register user
export async function registerUser(db, username, password, confirmPassword, name, language) {
	try {
		const users = db.collection('users');

		// Check if username already exists
		const userWithName = await users.findOne({ username });
		if (userWithName) {
			console.log('User with this name already exists');
			return { success: false, message: 'Username already exists' };
		}

		// Check if passwords match
		if (password !== confirmPassword) {
			console.log('Passwords do not match');
			return { success: false, message: 'Passwords do not match' };
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Generate unique match code
		let matchCode;
		let isUnique = false;
		while (!isUnique) {
			matchCode = await generateMatchCode();
			const userWithCode = await users.findOne({ matchCode });
			if (!userWithCode) {
				isUnique = true;
			}
		}

		// Insert new user
		const result = await users.insertOne({
			username,
			password: hashedPassword,
			name,
			matchCode,
			pfpNum: 0, // default profile picture
			streak: 0,
			score: 0,
			language,
			inPartnership: false,
			deck: [],
			createdAt: new Date()
		});

		console.log('User registered:', result.insertedId);

		return {
			success: true,
			userId: result.insertedId,
			matchCode
		};
	} catch (error) {
		console.error('Error registering user:', error);
		return { success: false, message: 'Server error' };
	}
}

