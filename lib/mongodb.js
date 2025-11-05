import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
let cached = global.mongoose;

if (!MONGODB_URI) {
    throw new Error("add your mongo uri to .env")
}

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "laklosette",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};



// let isConnected = null; //track connection
// export const connectDB = async () => {
//     if (isConnected) {
//         return
//     }

//     try {
//         const db = await mongoose.connect(MONGODB_URI, {
//             dbName: "laklosette"
//         })
//         isConnected = db.connections[0].readyState
//         console.log("MONGO DB CONNECTED");
//     } catch (error) {
//         console.error("mongo error", error);

//     }
// }
