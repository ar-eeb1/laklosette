import mongoose, { mongo } from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    avatar: {
        url: {
            type: String,
            trim: true,
        },
        public_id: {
            type: String,
            trime: true
        },
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        trime: true,
    },
    address: {
        type: String,
        trime: true,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods = {
    comparePassword: async function (password) {
        return await bcrypt.compare(password, this.password)
    }
}

const UserModel = mongoose.models.User || mongoose.model('User', userSchema, 'users')
export default UserModel