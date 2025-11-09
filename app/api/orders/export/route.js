import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order.model";

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
        
        const getOrder = await OrderModel.select("-products").sort({ createdAt: -1 }).lean()
        if (!getOrder) {
            return response(false, 404, 'Collection Empty')
        }
        return response(true, 200, 'Data exported',getOrder)

    } catch (error) {
        return catchError(error)
    }
}