'use client'
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import blackLogo from '@/public/assets/blackLogo.png'
import { IoIosSearch, IoMdClose } from 'react-icons/io'
import Cart from './Cart'
import { MenuOutlined, Person2Outlined } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import user from '@/public/assets/user.png'
import Search from './Search'

const Header = () => {
    const [isMobileMenu, setIsMobileMenu] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const auth = useSelector(store => store.authStore.auth)
    return (
        <div className='border-b border-gray-200 lg:px-32 px-4 shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-white/95'>
            <div className='flex justify-between items-center lg:py-6 py-4 max-w-screen-2xl mx-auto'>

                <Link href={WEBSITE_HOME} className='transition-transform hover:scale-105 duration-300'>
                    <Image
                        src={blackLogo}
                        width={380}
                        height={146}
                        alt='logo'
                        className='lg:w-56 w-24'
                    />
                </Link>

                <div className='flex justify-between gap-20'>
                    <nav className={`lg:relative lg:w-auto lg:top-0 lg:left-0 lg:p-0 lg:h-auto lg:bg-transparent bg-white fixed z-50 top-0 w-full h-screen transition-all duration-500 ease-in-out ${isMobileMenu ? 'left-0' : '-left-full'} lg:shadow-none shadow-2xl`}>
                        <div className='lg:hidden flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 py-4 border-b border-gray-200 px-4 shadow-sm'>
                            <Link href={WEBSITE_HOME}>
                                <Image
                                    src={blackLogo}
                                    width={280}
                                    height={246}
                                    alt='logo'
                                    className='lg:w-64 w-44'
                                />
                            </Link>

                            <button
                                type='button'
                                onClick={() => setIsMobileMenu(false)}
                                className='p-2 rounded-full hover:bg-gray-200 transition-all duration-200 active:scale-95'
                            >
                                <IoMdClose
                                    className='text-gray-600 hover:text-primary cursor-pointer transition-colors'
                                    size={28}
                                />
                            </button>
                        </div>
                        <ul className='lg:flex lg:justify-between lg:items-center lg:gap-10 lg:flex-row lg:px-0 px-6 flex flex-col items-start gap-1 lg:pt-0 pt-8'>
                            <li className='w-full lg:w-auto group'>
                                <Link href={WEBSITE_HOME} className='block py-3 lg:py-2 text-gray-700 hover:text-primary font-medium transition-all duration-200 relative lg:after:content-[""] lg:after:absolute lg:after:bottom-0 lg:after:left-0 lg:after:w-0 lg:after:h-0.5 lg:after:bg-primary lg:after:transition-all lg:after:duration-300 lg:hover:after:w-full rounded-lg lg:rounded-none lg:hover:bg-transparent hover:bg-gray-50 lg:px-0 px-4'>
                                    Home
                                </Link>
                            </li>
                            <li className='w-full lg:w-auto group'>
                                <Link href={WEBSITE_HOME} className='block py-3 lg:py-2 text-gray-700 hover:text-primary font-medium transition-all duration-200 relative lg:after:content-[""] lg:after:absolute lg:after:bottom-0 lg:after:left-0 lg:after:w-0 lg:after:h-0.5 lg:after:bg-primary lg:after:transition-all lg:after:duration-300 lg:hover:after:w-full rounded-lg lg:rounded-none lg:hover:bg-transparent hover:bg-gray-50 lg:px-0 px-4'>
                                    About
                                </Link>
                            </li>
                            <li className='w-full lg:w-auto group'>
                                <Link href={WEBSITE_SHOP} className='block py-3 lg:py-2 text-gray-700 hover:text-primary font-medium transition-all duration-200 relative lg:after:content-[""] lg:after:absolute lg:after:bottom-0 lg:after:left-0 lg:after:w-0 lg:after:h-0.5 lg:after:bg-primary lg:after:transition-all lg:after:duration-300 lg:hover:after:w-full rounded-lg lg:rounded-none lg:hover:bg-transparent hover:bg-gray-50 lg:px-0 px-4'>
                                    Shop
                                </Link>
                            </li>
                            <li className='w-full lg:w-auto group'>
                                <Link href={WEBSITE_HOME} className='block py-3 lg:py-2 text-gray-700 hover:text-primary font-medium transition-all duration-200 relative lg:after:content-[""] lg:after:absolute lg:after:bottom-0 lg:after:left-0 lg:after:w-0 lg:after:h-0.5 lg:after:bg-primary lg:after:transition-all lg:after:duration-300 lg:hover:after:w-full rounded-lg lg:rounded-none lg:hover:bg-transparent hover:bg-gray-50 lg:px-0 px-4'>
                                    T-Shirt
                                </Link>
                            </li>
                            <li className='w-full lg:w-auto group'>
                                <Link href={WEBSITE_HOME} className='block py-3 lg:py-2 text-gray-700 hover:text-primary font-medium transition-all duration-200 relative lg:after:content-[""] lg:after:absolute lg:after:bottom-0 lg:after:left-0 lg:after:w-0 lg:after:h-0.5 lg:after:bg-primary lg:after:transition-all lg:after:duration-300 lg:hover:after:w-full rounded-lg lg:rounded-none lg:hover:bg-transparent hover:bg-gray-50 lg:px-0 px-4'>
                                    Hoodies
                                </Link>
                            </li>
                            <li className='w-full lg:w-auto group'>
                                <Link href={WEBSITE_HOME} className='block py-3 lg:py-2 text-gray-700 hover:text-primary font-medium transition-all duration-200 relative lg:after:content-[""] lg:after:absolute lg:after:bottom-0 lg:after:left-0 lg:after:w-0 lg:after:h-0.5 lg:after:bg-primary lg:after:transition-all lg:after:duration-300 lg:hover:after:w-full rounded-lg lg:rounded-none lg:hover:bg-transparent hover:bg-gray-50 lg:px-0 px-4'>
                                    Oversized
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className='flex justify-between items-center gap-6 lg:gap-8'>
                        <button
                            type='button'
                            className='p-2 rounded-full hover:bg-gray-100 transition-all duration-200 active:scale-95'
                            onClick={() => setShowSearch(!showSearch)}
                        >
                            <IoIosSearch
                                className='text-gray-600 hover:text-primary cursor-pointer transition-colors duration-200'
                                size={24}
                            />
                        </button>
                        <div className='relative'>
                            <Cart />
                        </div>
                        {!auth ?
                            <Link
                                href={WEBSITE_LOGIN}
                                className='p-2 rounded-full hover:bg-gray-100 transition-all duration-200 active:scale-95'
                            >
                                <Person2Outlined className='text-gray-600 hover:text-primary cursor-pointer transition-colors duration-200' />
                            </Link>
                            :
                            <Link
                                href={USER_DASHBOARD}
                                className='ring-2 ring-transparent hover:ring-primary/20 rounded-full transition-all duration-200 active:scale-95'
                            >
                                <Avatar className='w-9 h-9 border-2 border-gray-200 hover:border-primary transition-colors duration-200'>
                                    <AvatarImage
                                        src={auth?.avatar?.url || user.src}
                                    />
                                </Avatar>
                            </Link>
                        }

                        <button
                            type='button'
                            className='lg:hidden block p-2 rounded-full hover:bg-gray-100 transition-all duration-200 active:scale-95'
                            onClick={() => setIsMobileMenu(true)}
                        >
                            <MenuOutlined className='text-gray-600 hover:text-primary cursor-pointer transition-colors duration-200' />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu overlay */}
            {isMobileMenu && (
                <div
                    className='lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300'
                    onClick={() => setIsMobileMenu(false)}
                />
            )}
            <Search isShow={showSearch}/>
        </div>
    )
}

export default Header