import mongoose from "mongoose";

const uri = "mongodb+srv://la-klosette:laklosette321@cluster0.gebnyxi.mongodb.net/laklosette?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  try {
    const conn = await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB:", conn.connection.host);
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  }
}

testConnection();
