import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import SearchModel from './SearchModel'

const AdminSearch = () => {
    const [open, setOpen] = useState(false)
    return (
        <div className='md:w-[350px]'>
            <div className='flex justify-between items-center relative'>
                <Input
                    readOnly
                    onClick={()=>setOpen(true)}
                    className='rounded-full cursor-pointer'
                    placeholder='Search...'
                />
                <button type='button' className='absolute right-3 cursor-default'>
                    <IoSearch />
                </button>

                <SearchModel open={open} setOpen={setOpen} />
            </div>
        </div>
    )
}

export default AdminSearch
