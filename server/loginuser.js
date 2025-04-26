const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = 'mongodb://10.135.168.95/27017'; // your MongoDB URI
const client = new MongoClient(uri);

async function loginUser(username, password) {
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

loginUser("griffin", "1234").catch(console.dir)