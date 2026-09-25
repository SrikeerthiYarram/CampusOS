import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('your_username')) {
    console.warn('\n⚠️ [CampusOS Database Warning]: MONGODB_URI is not configured in server/.env yet.');
    console.warn('💡 Please create "server/.env" and add your MongoDB Atlas connection string:');
    console.warn('   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/campusos\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || 'campusos',
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log(`\n🚀 [CampusOS Database Connected]: MongoDB Atlas Host -> ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}\n`);
    return true;
  } catch (error) {
    console.error(`\n❌ [CampusOS MongoDB Connection Error]: ${error.message}`);
    console.warn('💡 Check your MongoDB Atlas Network Access (allow 0.0.0.0/0 or current IP) and user credentials.\n');
    return false;
  }
};

export const getDBStatus = () => isConnected;
