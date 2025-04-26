import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

// Load environment variables
dotenv.config();

// MongoDB connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);


export default async function loginUser(username, password) {
  try {
    await client.connect();
    const db = client.db('lovelang');
    const users = db.collection('users');

    // Find user by username
    const user = await users.findOne({ username });

    if (!user) {
      console.log('User not found');
      return;
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log('Login successful!');
    } else {
      console.log('Incorrect password.');
    }
  } catch (error) {
    console.error('Error logging in:', error);
  } finally {
    await client.close();
  }
}

//loginUser("griffin", "1234").catch(console.dir)
