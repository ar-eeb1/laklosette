import { response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/mongodb";
import { cookies } from "next/headers"


export async function POST(request){
    try {
        await connectDB()
        const cookiesStore = await cookies()
        cookiesStore.delete('access_token')
        return response(true,200,'Logout')
    } catch (error) {
        
    }
}