'use client'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import ImgPlaceholder from '@/public/products/41o7qz+iJfL.jpg'
import { IoStar } from 'react-icons/io5'
import useFetch from '@/hooks/useFetch'
import notFound from '@/public/assets/notFound.jpg'
import Image from 'next/image'


const LatestReview = () => {
    const [latestReview, setLatestReview] = useState()
    const { data: getLatestReview, loading } = useFetch('/api/dashboard/admin/latest-review')

    useEffect(() => {
        if (getLatestReview && getLatestReview.success) {
            setLatestReview(getLatestReview.data)
        }
    }, [getLatestReview])

    
    if (loading) return <div className='h-full w-full flex justify-center items-center'>Loading...</div>
    if (!latestReview || latestReview.length === 0) return <div className='h-full w-full flex justify-center items-center'>
        <Image
            src={notFound.src}
            width={notFound.width}
            height={notFound.height}
            alt='IMAGE NOT FOUND'
            className='w-20'
        />
    </div>


    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow >
                        <TableHead>Product</TableHead>
                        <TableHead>Rating</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody >

                    {latestReview?.map((review) => (
                        <TableRow key={review._id} >
                            <TableCell className='flex items-center gap-3'>
                                <Avatar>
                                    <AvatarImage
                                        src={review?.product?.media[0]?.secure_url || ImgPlaceholder.src}
                                    />
                                </Avatar>
                                <span className='line-clamp-1'>{review?.product?.name || 'Not Found'}</span>
                            </TableCell>
                            <TableCell>
                                <div className='flex items-center'>
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <IoStar key={i} className='fill-yellow-500' />
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default LatestReview
