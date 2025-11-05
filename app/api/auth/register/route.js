import { emailVerificationLink } from "@/email/emailVerficationLink";
import { catchError } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.models";
import { SignJWT } from "jose";
import { response } from "@/lib/helperFunction";

export async function POST(request) {
    try {
        await connectDB()
        const validationSchema = zSchema.pick({
            name: true, email: true, password: true
        })

        const payLoad = await request.json()
        const validatedData = validationSchema.safeParse(payLoad)

        if (!validatedData.success) {
            return response(false, 401, 'invalid or missing input fields', validatedData.error)
        }

        const { name, email, password } = validatedData.data

        // check user existence
        const checkUser = await UserModel.exists({ email })
        if (checkUser) {
            return response(true, 409, 'user already register')
        }

        // new rigester
        const newRegistration = new UserModel({
            name, email, password
        })
        await newRegistration.save()
        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const token = await new SignJWT({ userId: newRegistration._id.toString() })
            .setIssuedAt()
            .setExpirationTime('1h')
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secret)


        await sendMail('Email verification request from Areeb', email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))
        return response(true, 200, "registration success, please verify your email address")

    } catch (error) {
        catchError(error)
    }
}









//         const secret = new TextEncoder().encode(process.env.SECRET_KEY)
//         const decoded = await jwtVerify(token, secret)
//         const userId = decoded.payload.userId
//         console.log(decoded);
//         if(!isValidObjectId(userId)){
//             return response(false,400,"invalud user id ",userId)
//         }

//         // get user
//         const user = await UserModel.findById(userId)
//         if(!user){
//             return response(false,400,'user not found')
//         }

//         user.isEmailVerified = true
//         await user.save()

        
