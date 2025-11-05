import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    discountPercentage: {
        required: true,
        type: Number,
        trim: true
    },
    minShoppingAmount: {
        required: true,
        type: Number,
        trim: true
    },
    validity: {
        required: true,
        type: Date,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    },
}, { timestamps: true })

const CouponModel = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema, 'coupons')
export default CouponModel