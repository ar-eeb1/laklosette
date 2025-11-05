import AppSidebar from '@/components/Application/Admin/AppSidebar'
import ThemeProvider from '@/components/Application/Admin/ThemeProvider'
import TopBar from '@/components/Application/Admin/TopBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({ children }) => {
    return (
        <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
        >

            <SidebarProvider>
                <AppSidebar />
                <main className='w-full md:w-[calc(100vw-16rem)] '>
                    <div className='px-[30px] md:px-[70px] min-h-[calc(100vh-40px)] pb-10'>
                        <TopBar />
                        {children}
                    </div>

                    <div className='border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm'>
                        &copy; 2025 Developed By Areeb&trade;. All Rights Reserved
                    </div>
                </main>
            </SidebarProvider>
        </ThemeProvider>
    )
}

export default layout
