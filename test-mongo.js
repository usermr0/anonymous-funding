const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://userninexd:BlindMoney%400901@cluster0.ul9ted2.mongodb.net/donations?retryWrites=true&w=majority";

async function testConnection() {
  console.log('Testing MongoDB connection...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected successfully to MongoDB');

    const db = client.db('donations');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    await client.close();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();