'use client'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import UserDropDown from './UserDropDown'
import { Button } from '@/components/ui/button'
import { RiMenu4Fill } from 'react-icons/ri'
import { useSidebar } from '@/components/ui/sidebar'
import AdminSearch from './AdminSearch'
import blackLogo from '@/public/assets/blackLogo.png'
import whiteLogo from '@/public/assets/whiteLogo.png'
import Image from 'next/image'
import AdminMobileSearch from './AdminMobileSearch'

function TopBar() {
    const { toggleSidebar } = useSidebar()
    return (
        <div className='fixed border h-14  w-full top-0 left-0 z-30 md:pl-72 pe-8 px-5 justify-between items-center bg-white dark:bg-card flex '>
            <div className='flex items-center md:hidden'>
                <Image className="h-[30px] w-auto block dark:hidden" src={blackLogo.src} alt="logo" width={220} height={50} />
                <Image className="h-[30px] w-auto dark:block hidden" src={whiteLogo.src} alt="logo" width={220} height={50} />
            </div>
            <div className='md:block hidden'>
                <AdminSearch />
            </div>
            <div className='flex items-center gap-2 '>
                <AdminMobileSearch/>
                <ThemeSwitch />
                <UserDropDown />
                <Button onClick={toggleSidebar} className="ms-2 md:hidden " type="button" size="icon" >
                    <RiMenu4Fill />
                </Button>
            </div>

        </div>
    )
}

export default TopBar
