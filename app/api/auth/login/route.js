import { emailVerificationLink } from "@/email/emailVerficationLink"
import { otpemail } from "@/email/otpemail"
import { catchError, generateOTP, response } from "@/lib/helperFunction"
import { connectDB } from "@/lib/mongodb"
import { sendMail } from "@/lib/sendMail"
import { zSchema } from "@/lib/zodSchema"
import OTPModel from "@/models/otp.model"
import UserModel from "@/models/User.models"
import { SignJWT } from "jose"
import z from "zod"

export async function POST(request) {
    try {
        await connectDB()
        const payLoad = await request.json()

        const validationSchema = zSchema.pick({
            email: true
        }).extend({
            password: z.string()
        })

        const validatedData = validationSchema.safeParse(payLoad)
        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input field', validatedData.error)
        }

        const { email, password } = validatedData.data

        // get user data
        const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password")

        if (!getUser) {
            return response(false, 404, 'Invalid login credentials')
        }

        // resend email
        if (!getUser.isEmailVerified) {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY)
            const token = await new SignJWT({ userId: getUser._id.toString() })
                .setIssuedAt()
                .setExpirationTime('1h')
                .setProtectedHeader({ alg: 'HS256' })
                .sign(secret)


            await sendMail('Email verification request from Areeb', email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))
            return response(false, 401, "Verify your email to complete registration.")
        }
        // password verification
        const isPasswordVerified = await getUser.comparePassword(password)

        if (!isPasswordVerified) {
            return response(false, 400, 'Invalid login credentails')
        }

        // otp generation
        await OTPModel.deleteMany({ email }) // delete olt otps

        const otp = generateOTP()
        // storing otp in db
        const newOtpData = new OTPModel({
            email, otp
        })
        await newOtpData.save()

        const otpEmailStatus = await sendMail('Your Login Verification code', email, otpemail(otp))

        if (!otpEmailStatus.success) {
            return response(false, 400, 'Failed to send OTP')
        }

        return response(true, 200, 'Please Verify')


    } catch (error) {
        return catchError(error)
    }
}