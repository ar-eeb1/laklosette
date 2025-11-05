import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/Product.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'unauthorized')
        }
        await connectDB()

        const payload = await request.json()
        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Invalid or Empty id list')
        }

        const category = await ProductModel.find({ _id: { $in: ids } }).lean()
        if (!category.length) {
            return response(false, 404, 'Data not found')
        }

        if (!['SD', 'RSD'].includes(deleteType)) {
            return response(false, 400, 'Invalid delete Operation')
        }

        if (deleteType === 'SD') {
            await ProductModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: new Date().toISOString() } })
        } else {
            await ProductModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })
        }

        return response(true, 200, deleteType === 'SD' ? 'Data moved to trash' : 'Data Restored')
    } catch (error) {
        return catchError(error)
    }
}

export async function DELETE(request) {

    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'unauthorized')
        }
        await connectDB()

        const payload = await request.json()
        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Invalid or Empty id list')
        }

        const category = await ProductModel.find({ _id: { $in: ids } }).lean()
        if (!category.length) {
            return response(false, 404, 'Data not found')
        }

        if (deleteType !== 'PD') {
            return response(false, 400, 'Invalid delete Operation delete should be PD')
        }

        await ProductModel.deleteMany({ _id: { $in: ids } })
        return response(true, 200, 'Data deleted permanently')

    } catch (error) {
        return catchError(error)
    }
}