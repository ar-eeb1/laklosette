import { catchError, response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User.models";
import { jwtVerify } from "jose";

export async function POST(request) {
  try {
    await connectDB()
    const {token} = await request.json()
    
    if(!token){
      return response(false,400,'Missing token')
    }
    const secret = new TextEncoder().encode(process.env.SECRET_KEY)
    const decoded = await jwtVerify(token,secret)
    const userId = decoded.payload.userId

    // get user
    const user = await UserModel.findById(userId)
    if(!user){
      return response(false,404,"user not found")
    }
    user.isEmailVerified = true
    await user.save()

    return response(true,200,"Email Verified")



  } catch (error) {
    return catchError(error)
  }
}









// import { catchError, response } from "@/lib/helperFunction";
// import { connectDB } from "@/lib/mongodb";
// import { jwtVerify } from "jose";

// export async function POST(request) {
//   try {
//     await connectDB()
//     const { token } = await request.json()

//     if (!token) {
//       return response(false, 400, 'missing token')
//     }
//     const secret = new TextEncoder().encode(process.env.SECRET_KEY)
//     const decoded = await jwtVerify(token, secret)
//     console.log(decoded , " decoded");
    
//     const userId = decoded.payload.userId

//     // get user
//     const user = await UserModel.findbyId(userId)
//     if (!user) {
//       return response(false, 404, 'user not found')
//     }

//     user.isEmailverified = true
//     await user.save()

//     return response(true,200, 'email verification success')

//   } catch (error) {
//     return catchError(error)
//   }
// }