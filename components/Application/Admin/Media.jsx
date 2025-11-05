
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { showToast } from '@/lib/showToast'
import { ADMIN_MEDIA_EDIT } from '@/routes/AdminPanelRoute'
import { Edit, EllipsisVerticalIcon, Link2Icon, Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const Media = ({ media, handleDelete, deleteType, selectedMedia, setSelectedMedia }) => {
    const handleCheck = () => {
        let newSelectedMedia = []
        if (selectedMedia.includes(media._id)) {
            newSelectedMedia = selectedMedia.filter(m => m !== media._id)
        } else {
            newSelectedMedia = [...selectedMedia, media._id]
        }
        setSelectedMedia(newSelectedMedia)
    }

    const copyLink = async (url) => {
        await navigator.clipboard.writeText(url)
        showToast('success', 'Link Copied')
    }

    return (
        <div className="border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden">
            <div className="absolute top-2 left-2 z-20">
                <Checkbox
                    className='cursor-pointer'
                    checked={selectedMedia.includes(media._id)}
                    onCheckedChange={handleCheck}
                />
            </div>

            <div className="absolute top-2 right-2 z-20">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <span className='bg-black/30 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer p-0'>
                            <EllipsisVerticalIcon className='text-white w-4 h-4' />
                        </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                        {deleteType === 'SD' &&
                            <div>
                                <DropdownMenuItem asChild className='cursor-pointer'>
                                    <Link href={ADMIN_MEDIA_EDIT(media._id)}>
                                        <Edit />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => copyLink(media.secure_url)} className='cursor-pointer'>
                                    <Link2Icon />
                                    Copy Link
                                </DropdownMenuItem>
                            </div>
                        }
                        <DropdownMenuItem className='bg-red-500 text-white cursor-pointer' onClick={() => handleDelete([media._id], deleteType)}>
                            <Trash className='text-white' />
                            {deleteType === 'SD' ? 'Move into Trash' : 'Delete Permanently'}
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>


            <Image
                src={media?.secure_url}
                alt={media?.alt || "image"}
                height={300}
                width={300}
                className="object-cover w-full sm:h-[200px] h-[150px]"
            />

            <div className="absolute inset-0 z-10 transition-all duration-150 ease-in group-hover:bg-black/30"></div>
        </div>
    )
}

export default Media
