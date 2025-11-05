import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/mongodb";
import productVariantModel from "@/models/ProductVariant.model";

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
        
        const getProductVariant = await productVariantModel.find(filter).sort({ createdAt: -1 }).lean()
        if (!getProductVariant) { 
            return response(false, 404, 'Product Variant Empty')
        }
        return response(true, 200, 'Data exported',getProductVariant)

    } catch (error) {
        return catchError(error)
    }
}