import { catchError, response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import productVariantModel from "@/models/ProductVariant.model";

export async function GET() {
    try {

        await connectDB()

        const getColor = await productVariantModel.distinct('color')
        if (!getColor) {
            return response(false, 404, 'color not found')
        }
        return response(true, 200, 'color Found', getColor)
    } catch (error) {
        return catchError(error)
    }
}