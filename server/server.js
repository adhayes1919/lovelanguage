require('dotenv'.config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);


async function run() {
  try {
    await client.connect();
    const db = client.db("your_database_name");
    const collection = db.collection("your_collection_name");
    
    // they can now read/write
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

