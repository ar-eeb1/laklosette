import { isAuthenticated } from "@/lib/authentication";
import { catchError } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order.model";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }
        await connectDB()
        const searcParams = request.nextUrl.searchParams

        // extract query parameter
        const start = parseInt(searcParams.get('start') || 0, 10)
        const size = parseInt(searcParams.get('size') || 10, 10)
        const filters = JSON.parse(searcParams.get('filters') || "[]")
        const globalFilter = searcParams.get('globalFilter') || ''
        const sorting = JSON.parse(searcParams.get('sorting') || "[]")
        const deleteType = searcParams.get('deleteType')

        //build match query
        let matchQuery = {}
        if (deleteType === 'SD') {
            matchQuery = { deletedAt: null }
        } else if (deleteType === 'PD') {
            matchQuery = { deletedAt: { $ne: null } }
        }

        // global search
        if (globalFilter) {
            matchQuery["$or"] = [
                { order_id: { $regex: globalFilter, $options: 'i' } },
                { payment_id: { $regex: globalFilter, $options: 'i' } },
                { name: { $regex: globalFilter, $options: 'i' } },
                { email: { $regex: globalFilter, $options: 'i' } },
                { phone: { $regex: globalFilter, $options: 'i' } },
                { country: { $regex: globalFilter, $options: 'i' } },
                { state: { $regex: globalFilter, $options: 'i' } },
                { city: { $regex: globalFilter, $options: 'i' } },
                { pincode: { $regex: globalFilter, $options: 'i' } },
                { subtotal: { $regex: globalFilter, $options: 'i' } },
                { discount: { $regex: globalFilter, $options: 'i' } },
                { couponDiscount: { $regex: globalFilter, $options: 'i' } },
                { totalAmount: { $regex: globalFilter, $options: 'i' } },
                { status: { $regex: globalFilter, $options: 'i' } },

            ]
        }

        // column filteration
        filters.forEach(filter => {
            matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
        });

        // sorting
        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        });

        // aggregate pipleline
        const aggregatePipeline = [
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
          
        ]

        // execute query
        const getOrders = await OrderModel.aggregate(aggregatePipeline)

        // get total rowscount
        const totalRowCount = await OrderModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getOrders,
            meta: { totalRowCount }
        })

    } catch (error) {
        return catchError(error)
    }
}