import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';
import cors from 'cors';
import express from 'express';
import registerUser from './registeruser.js';
import { deck_upsertCardBack, deck_updateCardEase, deck_requestCard, deck_getRequestsReceived, deck_getFullDeck, deck_getCardInfo } from './deck.js';
import getLeaderboard from './leaderboard.js';
import { incrementStreak, addPoints } from './couple.js'
import loginUser from './loginuser.js';
import ISO6391 from 'iso-639-1';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
await client.connect();
const db = client.db('lovelang');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.post("/api/register", async (req,res) => {
    const { username, password, confirmPassword, name, language } = req.body;
    if ( password != confirmPassword ) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    if (!ISO6391.validate(language)) {
        return res.status(400).json({ success: false, message: 'Invalid language.' });
    }
    try {
        const result = await registerUser(db, username, password, confirmPassword, name, language);
        if (result === -1) {
            return res.status(400).json({ success: false, message: 'Username already exists' }); 
        }
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post("/api/login", async (req,res) => {
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

/* DECK COMMANDS */

app.post("/api/deck_upsertCardBack", async (req, res) => {
	const { user_id, txt_front, txt_back } = req.body;

	try {
		await deck_upsertCardBack(db, user_id, txt_front, txt_back);
		res.status(200).send('Card upserted successfully');
	} catch (error) {
		console.error('Error in /deck_upsertCardBack:', error);
		res.status(500).send('Server error');
	}
});

app.post("/api/deck_updateCardEase", async (req, res) => {
	const { user_id, txt_front, score } = req.body;

	try {
		await deck_updateCardEase(db, user_id, txt_front, score);
		res.status(200).send('Card ease updated successfully');
	} catch (error) {
		console.error('Error in /deck_updateCardEase:', error);
		res.status(500).send('Server error');
	}
});

app.post("/api/deck_requestCard", async (req, res) => {
	const { userA_id, txt_request } = req.body;

	try {
		await deck_requestCard(db, userA_id, txt_request);
		res.status(200).send('Request created successfully');
	} catch (error) {
		console.error('Error in /deck_requestCard:', error);
		res.status(500).send('Server error');
	}
});

app.post("/api/deck_getRequestsReceived", async (req, res) => {
	const { user_id } = req.body;

	try {
		const requestsReceived = await deck_getRequestsReceived(db, user_id);
		res.status(200).json(requestsReceived);
	} catch (error) {
		console.error('Error in /deck_getRequestsReceived:', error);
		res.status(500).send('Server error');
	}
});

app.post("/api/deck_getFullDeck", async (req, res) => {
	const { user_id } = req.body;

	try {
		const deck = await deck_getFullDeck(db, user_id);
		if (deck) {
			res.status(200).json(deck);
		} else {
			res.status(404).send('No deck found');
		}
	} catch (error) {
		console.error('Error in /deck_getFullDeck:', error);
		res.status(500).send('Server error');
	}
});

app.post("/api/deck_getCardInfo", async (req, res) => {
	const { user_id, txt_front } = req.body;

	try {
		const card = await deck_getCardInfo(db, user_id, txt_front);
		if (card) {
			res.status(200).json(card);
		} else {
			res.status(404).send('No matching card found');
		}
	} catch (error) {
		console.error('Error in /deck_getCardInfo:', error);
		res.status(500).send('Server error');
	}
});

/* LEADERBOARD COMMANDS */

app.post("/api/getLeaderboard", async (req, res) => {
	const { mode, limit } = req.body;

	try {
		const leaderboard = await getLeaderboard(db, mode, limit);
		res.status(200).json(leaderboard);
	} catch (error) {
		console.error('Error in /getLeaderboard:', error);
		res.status(500).send('Server error');
	}
});

/* SCORING COMMANDS */

app.post("/api/addPoints", async (req, res) => {
	const { user_id, count } = req.body;

	try {
		await addPoints(db, user_id, count);
		res.status(200).send('Points added successfully');
	} catch (error) {
		console.error('Error in /addPoints:', error);
		res.status(500).send('Server error');
	}
});

app.post("/api/incrementStreak", async (req, res) => {
	const { user_id } = req.body;

	try {
		await incrementStreak(db, user_id);
		res.status(200).send('Streak incremented successfully');
	} catch (error) {
		console.error('Error in /incrementStreak:', error);
		res.status(500).send('Server error');
	}
});

/* SERVER COMMANDS*/

app.post("/api/couple_findMatch", async (req, res) => {
	const { userA_id, searchMatchCode } = req.body;

	try {
		await couple_findMatch(db, userA_id, searchMatchCode);
		res.status(200).send('Partnership created successfully');
	} catch (error) {
		console.error('Error in /couple_findMatch:', error);
		res.status(500).send('Server error');
	}
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
