const { MongoClient } = require('mongodb');

const uri = "mongodb://10.135.168.95:27017";  // your IP address
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

