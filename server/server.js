// server.js - CLEANED UP VERSION

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import ISO6391 from 'iso-639-1';

// Handlers
import { registerUser, loginUser } from './auth.js';
import { user_getDetails, user_getPartner } from './user.js';
import { couple_findMatch } from './couple.js';
import { 
  deck_upsertCardBack, 
  deck_updateCardEase, 
  deck_requestCard, 
  deck_getRequestsReceived, 
  deck_getFullDeck, 
  deck_getCardInfo 
} from './deck.js';
import { addPoints, incrementStreak, getLeaderboard } from './scoring.js';

// Database Setup
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
await client.connect();
const db = client.db('lovelang');

// Express App Setup
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

/* --- AUTH ROUTES --- */

app.post("/api/auth/register", async (req, res) => {
  const { name, language, username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) return res.status(400).json({ success: false, message: 'Passwords do not match' });
  if (!ISO6391.validate(language)) return res.status(400).json({ success: false, message: `Invalid language code: ${language}` });

  try {
    const result = await registerUser(db, name, language, username, password, confirmPassword);
    if (!result.success) return res.status(400).json({ success: false, message: result.message });
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await loginUser(db, username, password);
    if (!result.success) return res.status(401).json({ success: false, message: 'Incorrect username or password' });
    res.status(200).json({ success: true, userId: result.userId.toString() });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* --- USER ROUTES --- */

app.post("/api/user/get-details", async (req, res) => {
  const { user_id } = req.body;
  try {
    const userDetails = await user_getDetails(db, user_id);
    if (!userDetails) return res.status(404).send('User not found');
    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error in get-details:', error);
    res.status(500).send('Server error');
  }
});

app.post("/api/user/get-partner", async (req, res) => {
  const { user_id } = req.body;
  try {
    const partnerDetails = await user_getPartner(db, user_id);
    if (partnerDetails.error) return res.status(404).json({ message: partnerDetails.error });
    res.status(200).json(partnerDetails);
  } catch (error) {
    console.error('Error in get-partner:', error);
    res.status(500).send('Server error');
  }
});

/* --- DECK ROUTES --- */

// Request a card from your partner
app.post("/api/deck/request-card", async (req, res) => {
  const { userA_id, txt_request } = req.body;
  try {
    await deck_requestCard(db, userA_id, txt_request);
    res.status(200).send('Request created');
  } catch (error) {
    console.error('Error requesting card:', error);
    res.status(500).send('Server error');
  }
});

// View cards you received
app.post("/api/deck/requests-received", async (req, res) => {
  const { user_id } = req.body;
  try {
    const requests = await deck_getRequestsReceived(db, user_id);
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).send('Server error');
  }
});

// Submit a finished card (answer a request)
app.post("/api/deck/submit-card", async (req, res) => {
  const { user_id, txt_front, txt_back } = req.body;
  try {
    await deck_upsertCardBack(db, user_id, txt_front, txt_back);
    await db.collection('requests').deleteOne({ recipient_id: new ObjectId(user_id), txt_request: txt_front });
    res.status(200).send('Card submitted successfully');
  } catch (error) {
    console.error('Error submitting card:', error);
    res.status(500).send('Server error');
  }
});

// View completed deck
app.post("/api/deck/full-deck", async (req, res) => {
  const { user_id } = req.body;
  try {
    const deck = await deck_getFullDeck(db, user_id);
    if (!deck) return res.status(404).send('No deck found');
    res.status(200).json(deck);
  } catch (error) {
    console.error('Error fetching full deck:', error);
    res.status(500).send('Server error');
  }
});

// Update a card's ease score after study
app.post("/api/deck/update-card-ease", async (req, res) => {
  const { user_id, txt_front, score } = req.body;
  try {
    await deck_updateCardEase(db, user_id, txt_front, score);
    res.status(200).send('Ease updated');
  } catch (error) {
    console.error('Error updating ease:', error);
    res.status(500).send('Server error');
  }
});

// View info about a specific card
app.post("/api/deck/card-info", async (req, res) => {
  const { user_id, txt_front } = req.body;
  try {
    const card = await deck_getCardInfo(db, user_id, txt_front);
    if (!card) return res.status(404).send('Card not found');
    res.status(200).json(card);
  } catch (error) {
    console.error('Error fetching card info:', error);
    res.status(500).send('Server error');
  }
});

/* --- SCORING ROUTES --- */

app.post("/api/scoring/add-points", async (req, res) => {
  const { user_id, count } = req.body;
  try {
    await addPoints(db, user_id, count);
    res.status(200).send('Points added');
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).send('Server error');
  }
});

app.post("/api/scoring/increment-streak", async (req, res) => {
  const { user_id } = req.body;
  try {
    await incrementStreak(db, user_id);
    res.status(200).send('Streak incremented');
  } catch (error) {
    console.error('Error incrementing streak:', error);
    res.status(500).send('Server error');
  }
});

/* --- LEADERBOARD ROUTE --- */

app.post("/api/leaderboard", async (req, res) => {
  const { mode, limit } = req.body;
  try {
    const leaderboard = await getLeaderboard(db, mode, limit);
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).send('Server error');
  }
});

/* --- PARTNER ROUTES --- */

app.post("/api/partner/find-match", async (req, res) => {
  const { userA_id, searchMatchCode } = req.body;
  try {
    const result = await couple_findMatch(db, userA_id, searchMatchCode);
    if (!result.success) return res.status(400).json({ success: false, message: result.message });
    res.status(200).json({ success: true, message: 'Match created' });
  } catch (error) {
    console.error('Error finding match:', error);
    res.status(500).send('Server error');
  }
});

/* --- START SERVER --- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

