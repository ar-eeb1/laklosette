'use client'
import { Button } from '@/components/ui/button'
import { showToast } from '@/lib/showToast'
import { USER_DASHBOARD, USER_ORDERS, USER_PROFILE, WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
import { logout } from '@/store/reducer/authReducer'
import axios from 'axios'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux'

const UserPanelNavigation = () => {
    const pathname = usePathname()
    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogout = async () => {
        try {
            const { data: logoutResponse } = await axios.post('/api/auth/logout')
            if (!logoutResponse.success) {
                throw new Error(logoutResponse.message)
            }
            dispatch(logout())
            showToast('success', logoutResponse.message)
            router.push(WEBSITE_LOGIN)

        } catch (error) {
            showToast('error', error.message)
        }
    }
    return (
        <div className='border shadow-sm p-4 rounded'>
            <ul>
                <li className='mb-2 '>
                    <Link className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${pathname.startsWith(USER_DASHBOARD) ? 'bg-primary text-white' : ''}`} href={USER_DASHBOARD}>
                        Dashboard
                    </Link>
                </li>
                <li className='mb-2 '>
                    <Link className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${pathname.startsWith(USER_PROFILE) ? 'bg-primary text-white' : ''}`} href={USER_PROFILE}>
                        User Profile
                    </Link>
                </li>
                <li className='mb-2 '>
                    <Link className={`block p-3 text-sm rounded hover:bg-primary hover:text-white ${pathname.startsWith(USER_ORDERS) ? 'bg-primary text-white' : ''}`} href={USER_ORDERS}>
                        Orders
                    </Link>
                </li>
                <li className='mb-2 '>
                    <Button type='button' onClick={handleLogout} variant='destructive'>
                        Logout
                    </Button>
                </li>
            </ul>
        </div>
    )
}

export default UserPanelNavigation
