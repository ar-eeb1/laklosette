import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/mongodb";
import { isValidObjectId } from "mongoose";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";
import productVariantModel from "@/models/ProductVariant.model";
import CategoryModel from "@/models/Category.model";

export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'unauthorized')
        }
        await connectDB()
        const getParams = await params
        const id = getParams.id

        const filter = {
            deletedAt: null
        }

        if (!isValidObjectId(id)) {
            return response(false, 400, 'invalid object id')
        }
        filter._id = id

        const getProduct = await ProductModel.findOne(filter).populate('media', '_id secure_url').lean()
        if (!getProduct) {
            return response(false, 404, 'Product not found')
        }
        return response(true, 200, 'Product Found', getProduct)
    } catch (error) {
        return catchError(error)
    }
}