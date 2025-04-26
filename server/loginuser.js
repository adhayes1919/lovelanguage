import bcrypt from 'bcrypt';

export default async function loginUser(db, username, password) {
  try {
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
