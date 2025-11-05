import { isAuthenticated } from "@/lib/authentication";
import { catchError } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import productVariantModel from "@/models/ProductVariant.model";
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
                { name: { $regex: globalFilter, $options: 'i' } },
                { slug: { $regex: globalFilter, $options: 'i' } },
                { "productData.name": { $regex: globalFilter, $options: 'i' } }, {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: '$mrp' },
                            regex: globalFilter,
                            options: i
                        }
                    }
                },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: '$sellingPrice' },
                            regex: globalFilter,
                            options: i
                        }
                    }
                },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: '$discountPercentage' },
                            regex: globalFilter,
                            options: i
                        }
                    }
                },
            ]
        }

        filters.forEach(filter => {
            if (filter.id === 'mrp' || filter.id === 'sellingPrice' || filter.id === 'discountPercentage') {
                matchQuery[filter.id] = Number(filter.value)
            } else if (filter.id === 'product') {
                matchQuery['productData.name'] = { $regex: filter.value, $options: 'i' }
            } else {
                matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
            }
        });


        // sorting
        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        });

        // aggregate pipleline
        const aggregatePipeline = [
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productData',
                }
            },
            {
                $unwind: {
                    path: '$productData', preserveNullAndEmptyArrays: true
                }
            },
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    product: "$productData.name",
                    color: 1,
                    size: 1,
                    sku: 1,
                    mrp: 1,
                    sellingPrice: 1,
                    discountPercentage: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1,
                }
            }
        ]

        // execute query
        const getProductVariant = await productVariantModel.aggregate(aggregatePipeline)

        // get total rowscount
        const totalRowCount = await productVariantModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getProductVariant,
            meta: { totalRowCount }
        })

    } catch (error) {
        return catchError(error)
    }
}