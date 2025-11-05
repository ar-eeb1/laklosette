import { otpemail } from "@/email/otpemail";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/otp.model";
import UserModel from "@/models/User.models";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const validationSchema = zSchema.pick({
            email: true
        })

        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input field', validatedData.error)
        }

        const { email } = validatedData.data
        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean()
        if (!getUser) {
            return response(false, 404, 'user not found')
        }

        // remove old otps
        await OTPModel.deleteMany({ email })
        const otp = generateOTP()
        const newOtpdata = new OTPModel({
            email, otp
        })

        await newOtpdata.save()
        const OtpSendStatus = await sendMail('Your Login Verification Code', email, otpemail(otp))
        if (!OtpSendStatus.success) {
            return response(false, 400, 'Failed to resend OTP')
        }
        return response(true, 200, 'Verify your account')
    } catch (error) {
        catchError(error)
    }
}