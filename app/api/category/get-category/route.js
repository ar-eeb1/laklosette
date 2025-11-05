import { catchError, response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import { isValidObjectId } from "mongoose";
import CategoryModel from "@/models/Category.model";

export async function GET(request, { params }) {
    try {

        await connectDB()

        const getCategory = await CategoryModel.find({ deletedAt: null }).lean()
        if (!getCategory) {
            return response(false, 404, 'Category not found')
        }
        return response(true, 200, 'Category Found', getCategory)
    } catch (error) {
        return catchError(error)
    }
}