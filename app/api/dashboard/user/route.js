import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order.model";
import MediaModel from "@/models/Media.model";
import ProductModel from "@/models/Product.model";
import productVariantModel from "@/models/ProductVariant.model";

export async function GET() {
    try {
        await connectDB()
        const auth = await isAuthenticated('user')

        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized')
        }

        const userId = auth.userId
        // get recent orders
        const recentOrders = await OrderModel.find({ user: userId }).populate('products.productId', 'name slug').populate({
            path: 'products.variantId',
            populate: { path: 'media' }
        }).limit(10).lean()

        //total count of orders
        const totalOrder = await OrderModel.countDocuments({ user: userId })
        return response(true, 200, 'Dashboard info', { recentOrders, totalOrder })
    } catch (error) {
        return catchError(error)
    }
}