import { isAuthenticated } from "@/lib/authentication"
import { catchError, response } from "@/lib/helperFunction"
import { connectDB } from "@/lib/mongodb"
import CategoryModel from "@/models/Category.model"
import ProductModel from "@/models/Product.model"
import UserModel from "@/models/User.models"

export async function GET() {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }
        await connectDB()

        const [category, product, customer] = await Promise.all([
            CategoryModel.countDocuments({ deletedAt: null }),
            ProductModel.countDocuments({ deletedAt: null }),
            UserModel.countDocuments({ deletedAt: null })
        ])
        return response(200, true, 'Dashboard Count', { category, product, customer })

    } catch (error) {
        return catchError(error)
    }
}