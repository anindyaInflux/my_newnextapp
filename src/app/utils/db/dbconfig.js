// lib/dbConnect.js
import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config(); // Load environment variables

const connection = {}; 
console.log(process.env,"process")

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI environment variable is not defined');
}

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;