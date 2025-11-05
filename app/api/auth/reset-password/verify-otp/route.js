import { catchError, response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/otp.model";
import UserModel from "@/models/User.models";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const validationSchema = zSchema.pick({
            otp: true, email: true
        })

        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 401, 'invalid or missing input field', validatedData.error)
        }
        const { email, otp } = validatedData.data
        const getOtpData = await OTPModel.findOne({ email, otp })
        if (!getOtpData) {
            return response(false, 404, 'Invalid or expired OTP')
        }
        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean()
        if (!getUser) {
            return response(false, 404, 'User not found')
        }
        // remove otp after validation

        await getOtpData.deleteOne()
        return response(true, 200, 'OTP Verified')

    } catch (error) {
        return catchError(error)
    }
}