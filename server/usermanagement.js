import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';
import cors from 'cors';
import express from 'express';
import registerUser from './registeruser.js';
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


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
