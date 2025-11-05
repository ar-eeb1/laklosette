import { z } from "zod";

export const zSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "At least 8 characters long" })
    .max(64, { message: "At most 64 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),

  name: z
    .string()
    .min(2, { message: "Name must be at least 2 charecters" })
    .max(50, { message: "Name must be at most 50 charecters" }),
  otp: z
    .string()
    .regex(/^\d{6}$/, {
      message: "OTP must be a 6 Digit Number"
    }),
  _id: z.string().min(3, '_id is required'),
  alt: z.string().min(3, 'alt is required'),
  description: z.string().min(3, 'Description is required'),
  media: z.array(z.string()),
  title: z.string().min(3, 'title is required'),
  slug: z.string().min(3, 'slug is required'),
  category: z.string().min(3, 'Category is required'),
  product: z.string().min(3, 'Product is required'),
  userId: z.string().min(3, 'User id is required'),
  color: z.string().min(3, 'Color is required'),
  size: z.string().min(1, 'Size is required'),
  sku: z.string().min(1, 'SKU is required'),
  code: z.string().min(3, 'Code is required'),
  review: z.string().min(3, 'Review is required'),
  code: z.string().min(3, 'Code is required'),
  country: z.string().min(3, 'Country is required'),
  state: z.string().min(3, 'State is required'),
  city: z.string().min(3, 'City is required'),
  pincode: z.string().min(3, 'Pincode is required'),
  landmark: z.string().min(3, 'Landmark is required'),
  ordernote: z.string().min(0, 'Ordernote is required').optional(),
  phone: z.string().min(3, 'Phone is required'),
  // phone: z.string().regex(/^\+92\d{10}$/, 'Phone number must be in the format +923XXXXXXXXX'),
  validity: z.coerce.date(),
  mrp: z.union([
    z.number().positive('Expected postive value'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please Enter A valid number')
  ]),
  sellingPrice: z.union([
    z.number().positive('Expected postive value'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please Enter A valid number')
  ]),
  discountPercentage: z.union([
    z.number().positive('Expected postive value'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please Enter A valid number')
  ]),
  minShoppingAmount: z.union([
    z.number().positive('Expected postive value, received negative'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please Enter A valid number')
  ]),
  amount: z.union([
    z.number().positive('Expected postive value, received negative'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please Enter A valid number')
  ]),
  rating: z.union([
    z.number().positive('Expected postive value'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please Enter A valid number')
  ]),
});
