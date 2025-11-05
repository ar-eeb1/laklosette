'use client'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { showToast } from '@/lib/showToast'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
import { logout } from '@/store/reducer/authReducer'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { MdLogout } from 'react-icons/md'
import { useDispatch } from 'react-redux'

const LogoutButton = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogout = async () => {
        try {
            const {data : logoutResponse } = await axios.post('/api/auth/logout')
            if(!logoutResponse.success){
                throw new Error(logoutResponse.message)
            }
            dispatch(logout())
            showToast('success' , logoutResponse.message)
            router.push(WEBSITE_LOGIN)

        } catch (error) {
            showToast('error', error.message)
        }
    }
    return (
        <div>
            <DropdownMenuItem className='cursor-pointer'>
                <div onClick={handleLogout} className='flex items-center justify-center gap-2 text-lg  bg-red-500 w-full rounded-md  text-white'>
                    <MdLogout className='text-white' />
                    Logout
                </div>
            </DropdownMenuItem>
        </div>
    )
}

export default LogoutButton
