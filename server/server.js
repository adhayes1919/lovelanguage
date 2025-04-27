import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { user_getDetails } from './user.js';
import ISO6391 from 'iso-639-1';
import { registerUser, loginUser } from './auth.js';
import { addPoints, incrementStreak, getLeaderboard } from './scoring.js';
import { couple_findMatch } from './couple.js';
import { 
	deck_upsertCardBack,
	deck_updateCardEase,
	deck_requestCard,
	deck_getRequestsReceived,
	deck_getFullDeck,
	deck_getCardInfo
} from './deck.js';

// MongoDB
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
await client.connect();
const db = client.db('lovelang');

// Express
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

/* --- AUTH ROUTES --- */

app.post("/api/auth/register", async (req, res) => {
	const { username, password, confirmPassword, name, language } = req.body;

	if (password !== confirmPassword) {
		return res.status(400).json({ success: false, message: 'Passwords do not match' });
	}
	if (!ISO6391.validate(language)) {
		return res.status(400).json({ success: false, message: 'Invalid language.' });
	}

	try {
		const result = await registerUser(db, username, password, confirmPassword, name, language);
		if (!result.success) {
			return res.status(400).json({ success: false, message: result.message });
		}
		res.status(201).json({ success: true, message: 'User registered successfully' });
	} catch (error) {
		console.error('Error registering user:', error);
		res.status(500).json({ success: false, message: 'Server error' });
	}
});

app.post("/api/auth/login", async (req, res) => {
	const { username, password } = req.body;
	try {
		const success = await loginUser(db, username, password);
		if (!success) {
			return res.status(401).json({ success: false, message: 'Incorrect username or password' });
		}
		res.status(200).json({ success: true, message: 'Login successful' });
	} catch (error) {
		console.error('Error logging in:', error);
		res.status(500).json({ success: false, message: 'Server error' });
	}
});

/* USER COMMANDS */

app.post("/api/user-getDetails", async (req, res) => {
	const { user_id } = req.body;
	try {
		const userDetails = await user_getDetails(db, user_id);
        console.log(userDetails);
		if (userDetails) {
			res.status(200).json(userDetails);
		} else {
			res.status(404).send('User not found');
		}
	} catch (error) {
		console.error('Error in /user_getDetails:', error);
		res.status(500).send('Server error');
	}
});

app.post("/api/user-getPartner", async (req, res) => {
	const { user_id } = req.body;

	try {
		// Fetch partner details for the user
		const partnerDetails = await user_getPartner(db, user_id);

		if (partnerDetails.error) {
			// Send an error response if there's an issue
			res.status(404).json({ message: partnerDetails.error });
		} else {
			// Send partner details if found
			res.status(200).json(partnerDetails);
		}
	} catch (error) {
		console.error('Error in /getPartner:', error);
		res.status(500).send('Server error');
	}
});

/* DECK COMMANDS */

app.post("/api/deck/upsert-card-back", async (req, res) => {
	const { user_id, txt_front, txt_back } = req.body;
	try {
		await deck_upsertCardBack(db, user_id, txt_front, txt_back);
		res.status(200).send('Card upserted successfully');
	} catch (error) {
		console.error('Error in /deck/upsert-card-back:', error);
		res.status(500).send('Server error');
	}
});

app.post("/api/deck/update-card-ease", async (req, res) => {
	const { user_id, txt_front, score } = req.body;
	try {
		await deck_updateCardEase(db, user_id, txt_front, score);
		res.status(200).send('Card ease updated successfully');
	} catch (error) {
		console.error('Error in /deck/update-card-ease:', error);
		res.status(500).send('Server error');
	}
});

app.post("/api/deck/request-card", async (req, res) => {
	const { userA_id, txt_request } = req.body;
	try {
		await deck_requestCard(db, userA_id, txt_request);
		res.status(200).send('Card request created successfully');
	} catch (error) {
		console.error('Error in /deck/request-card:', error);
		res.status(500).send('Server error');
	}
});

app.post("/api/deck/requests-received", async (req, res) => {
	const { user_id } = req.body;
	try {
		const requestsReceived = await deck_getRequestsReceived(db, user_id);
		res.status(200).json(requestsReceived);
	} catch (error) {
		console.error('Error in /deck/requests-received:', error);
		res.status(500).send('Server error');
	}
});

app.post("/api/deck/full-deck", async (req, res) => {
	const { user_id } = req.body;
	try {
		const deck = await deck_getFullDeck(db, user_id);
		if (deck) {
			res.status(200).json(deck);
		} else {
			res.status(404).send('No deck found');
		}
	} catch (error) {
		console.error('Error in /deck/full-deck:', error);
		res.status(500).send('Server error');
	}
});

app.post("/api/deck/card-info", async (req, res) => {
	const { user_id, txt_front } = req.body;
	try {
		const card = await deck_getCardInfo(db, user_id, txt_front);
		if (card) {
			res.status(200).json(card);
		} else {
			res.status(404).send('No matching card found');
		}
	} catch (error) {
		console.error('Error in /deck/card-info:', error);
		res.status(500).send('Server error');
	}
});

/* --- SCORING ROUTES --- */

app.post("/api/scoring/add-points", async (req, res) => {
	const { user_id, count } = req.body;
	try {
		await addPoints(db, user_id, count);
		res.status(200).send('Points added successfully');
	} catch (error) {
		console.error('Error in /scoring/add-points:', error);
		res.status(500).send('Server error');
	}
});

app.post("/api/scoring/increment-streak", async (req, res) => {
	const { user_id } = req.body;
	try {
		await incrementStreak(db, user_id);
		res.status(200).send('Streak incremented successfully');
	} catch (error) {
		console.error('Error in /scoring/increment-streak:', error);
		res.status(500).send('Server error');
	}
});

/* --- LEADERBOARD ROUTES --- */

app.post("/api/leaderboard", async (req, res) => {
	const { mode, limit } = req.body;
	try {
		const leaderboard = await getLeaderboard(db, mode, limit);
		res.status(200).json(leaderboard);
	} catch (error) {
		console.error('Error in /leaderboard:', error);
		res.status(500).send('Server error');
	}
});

/* --- PARTNERSHIP ROUTES --- */

app.post("/api/partner/find-match", async (req, res) => {
	const { userA_id, searchMatchCode } = req.body;
	try {
		await couple_findMatch(db, userA_id, searchMatchCode);
		res.status(200).send('Partnership created successfully');
	} catch (error) {
		console.error('Error in /partner/find-match:', error);
		res.status(500).send('Server error');
	}
});

/* --- SERVER START --- */

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
