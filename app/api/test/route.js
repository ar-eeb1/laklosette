import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB()
  return NextResponse.json({
    success:true,
    message:'connection success'
  })
}

// import { connectDB } from "@/lib/mongodb";
// import mongoose from "mongoose";

// export async function GET() {
//   try {
//     await connectDB();

//     // optional: check DB connection status
//     const status = mongoose.connection.readyState; // 1 = connected
//     return Response.json({ message: "✅ API + DB working!", status });
//   } catch (err) {
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }
