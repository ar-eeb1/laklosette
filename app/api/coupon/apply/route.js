import { catchError, response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.model";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const couponFormSchema = zSchema.pick({
            code: true,
            minShoppingAmount: true
        })

        const validate = couponFormSchema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Missing or Invalid Data', validate.error)
        }
        const { code, minShoppingAmount } = validate.data
        const couponData = await CouponModel.findOne({ code }).lean()
        if (!couponData) {
            return response(false, 400, 'Invalid or expire Coupon')
        }

        if (new Date() > couponData.validity) {
            return response(false, 400, 'Coupon expired')
        }

        if (minShoppingAmount < couponData.minShoppingAmount) {
            return response(false, 400, 'In-sufficient Shopping amount')
        }

        return response(true, 200, 'Coupon Applied Successfully', { discountPercentage: couponData.discountPercentage })
    } catch (error) {
        return catchError(error)
    }
}