'use client'
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,

} from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import blackLogo from '@/public/assets/blackLogo.png'
import whiteLogo from '@/public/assets/whiteLogo.png'
import { adminAppSidebar, adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";

const AppSidebar = () => {
    const { toggleSidebar } = useSidebar()
    return (
        <Sidebar className='bg-gray-400 z-50'>
            <SidebarHeader className='border-b h-14 p-0 '>
                <div className="flex justify-between items-center ">
                    <Image className="h-[50px] w-auto block dark:hidden" src={blackLogo.src} alt="logo" width={250} height={50} />
                    <Image className="h-[50px] w-auto dark:block hidden" src={whiteLogo.src} alt="logo" width={250} height={50} />
                    <Button onClick={toggleSidebar} type='button' size='icon' className='md:hidden w-7 h-7 rounded-full mr-4 ' >
                        <IoMdClose />
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarContent  >
                <SidebarMenu>
                    {adminAppSidebarMenu.map((menu, index) => (
                        <Collapsible key={index} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton asChild className="font-semibold px-2 py-5 text-lg">
                                        <Link href={menu?.url} >
                                            <menu.icon />
                                            {menu.title}

                                            {menu.submenu && menu.submenu.length > 0 &&
                                                <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                
                                            }
                                        </Link>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                {menu.submenu && menu.submenu.length > 0 &&
                                    <CollapsibleContent >
                                        <SidebarMenuSub >
                                            {menu.submenu.map((subMenuItem, subMenuIndex) => (
                                                <SidebarMenuSubItem key={subMenuIndex}>
                                                    <SidebarMenuSubButton asChild className="px-2 py-5 text-l">
                                                        <Link href={subMenuItem.url}>
                                                            {subMenuItem.title}
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                }

                            </SidebarMenuItem>

                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar
