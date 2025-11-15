import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/mongodb";
import { isValidObjectId } from "mongoose";
import productVariantModel from "@/models/ProductVariant.model";
import MediaModel from "@/models/Media.model";

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

        const getProductVariant = await productVariantModel.findOne(filter).populate('media', '_id secure_url').populate('product' , 'name slug category description').lean()
        if (!getProductVariant) {
            return response(false, 404, 'Product Variant not found')
        }
        return response(true, 200, 'Product Variant Found', getProductVariant)
    } catch (error) {
        return catchError(error)
    }
}