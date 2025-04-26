import express from 'express';
import registerUser from './createuser.js';
import loginUser from './loginuser.js';

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const app = express();
app.use(express.json());

const PORT = process.env.port;

app.post("/register", (req,res) => {
    const { username, email, password, language } = req.body;
    try {
        const result = await registerUser(username, email, password, language);
        if (result === -1) {
            return res.status(400).json({ success: false, message: 'Username already exists' }); 
        }
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post("/login", (req,res) => {
    const { username, password } = req.body;

    try {
        const success = await loginUser(username, password);

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
