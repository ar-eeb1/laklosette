import { orderNotification } from "@/email/orderNotification";
import { catchError, response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OrderModel from "@/models/Order.model";
import { randomUUID } from "crypto";
import z from "zod";

export async function POST(request) {
    try {
        await connectDB();

        const payload = await request.json();

        const productSchema = z.object({
            productId: z.string().length(24, 'Invalid product Id format'),
            variantId: z.string().length(24, 'Invalid variant Id format'),
            name: z.string().min(1),
            qty: z.number().min(1),
            mrp: z.number().nonnegative(),
            sellingPrice: z.number().nonnegative(),
        });

        const orderSchema = zSchema.pick({
            name: true,
            email: true,
            phone: true,
            country: true,
            state: true,
            city: true,
            pincode: true,
            landmark: true,
            ordernote: true,
        }).extend({
            userId: z.string().optional(),
            subtotal: z.number().nonnegative(),
            discount: z.number().nonnegative(),
            couponDiscountAmount: z.number().nonnegative(),
            totalAmount: z.number().nonnegative(),
            products: z.array(productSchema),
        });

        const validate = orderSchema.safeParse(payload);

        if (!validate.success) {
            return response(false, 400, "Invalid or missing fields", { error: validate.error });
        }

        const validatedData = validate.data;

        const order_id = `ORD-${randomUUID().split('-')[0].toUpperCase()}`;

        const newOrder = await OrderModel.create({
            order_id,
            user: validatedData.userId,
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            country: validatedData.country,
            state: validatedData.state,
            city: validatedData.city,
            pincode: validatedData.pincode,
            landmark: validatedData.landmark,
            ordernote: validatedData.ordernote,
            products: validatedData.products,
            subtotal: validatedData.subtotal,
            discount: validatedData.discount,
            couponDiscountAmount: validatedData.couponDiscountAmount,
            totalAmount: validatedData.totalAmount,
        });
        console.log(newOrder);

        try {
            const mailData = {
                order_id,
                orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${order_id}`,
            };

            await sendMail(
                "Your order has been placed successfully",
                validatedData.email,
                orderNotification(mailData)
            );
        } catch (error) {
            console.error("Email sending error:", error);
        }

        return response(true, 200, "Order placed successfully", { order_id: order_id });

    } catch (error) {
        return catchError(error);
    }
}
