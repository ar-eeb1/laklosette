import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/mongodb";
import CouponModel from "@/models/Coupon.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'unauthorized')
        }
        await connectDB()
        const filter = {
            deletedAt: null
        }
        
        const getCoupon = await CouponModel.find(filter).sort({ createdAt: -1 }).lean()
        if (!getCoupon) {
            return response(false, 404, 'Collection Empty')
        }
        return response(true, 200, 'Data exported',getCoupon)

    } catch (error) {
        return catchError(error)
    }
}