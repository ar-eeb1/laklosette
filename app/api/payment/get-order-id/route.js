import { catchError, response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import { zSchema } from "@/lib/zodSchema";
import { randomUUID } from "crypto";

export async function POST(request) {
    try {
        await connectDB();
        const payload = await request.json();
        const schema = zSchema.pick({
            amount: true,
        });

        const validate = schema.safeParse(payload);
        if (!validate.success) {
            return response(false, 400, "Invalid or missing fields", validate.error);
        }

        const order_id = `ORD-${randomUUID().split('-')[0].toUpperCase()}`;

        return response(true, 200, "Order created successfully", {
            order_id: order_id,
            amount: validate.data.amount,
        });

    } catch (error) {
        return catchError(error);
    }
}
