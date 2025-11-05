import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import React from 'react'
import { IoShirtOutline } from 'react-icons/io5'
import { MdOutlineShoppingBag } from 'react-icons/md'
import { useSelector } from 'react-redux'
import LogoutButton from './LogoutButton'

const UserDropDown = () => {
  const auth = useSelector((store) => store.authStore.auth)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src='' />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='me-5 w-44'>
        <DropdownMenuLabel>
          <p className='font-semibold'>{auth?.name}</p>

        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className='cursor-pointer ' href="">
          <IoShirtOutline/>
            New Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className='cursor-pointer ' href="">
          <MdOutlineShoppingBag/>
            Orders
          </Link>
        </DropdownMenuItem>
        <LogoutButton/>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropDown
