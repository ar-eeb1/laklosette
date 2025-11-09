import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User.models";

export async function GET() {
    try {
        await connectDB()
        const auth = await isAuthenticated('user')
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized')
        }

        const userId = auth.userId
        const user = await UserModel.findById(userId).lean()
        return response(true, 200,'Profile data' , user)

    } catch (error) {
        return catchError(error)
    }
}