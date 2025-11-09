'use client'
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import useFetch from '@/hooks/useFetch'
import notFound from '@/public/assets/notFound.jpg'
import Image from 'next/image'
import { statusBadge } from '@/lib/helperFunction'

const LatestOrder = () => {
    const [latestOrder, setLatestOrder] = useState()
    const { data, loading } = useFetch('/api/dashboard/admin/latest-order')


    useEffect(() => {
        if (data && data.success) {
            setLatestOrder(data.data)
        }
    }, [data])
    
    

    if (loading) return <div className='h-full w-full flex justify-center items-center'>Loading...</div>

    if (!latestOrder || latestOrder.length === 0) return <div className='h-full w-full flex justify-center items-center'>
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
                        <TableHead>Order Id</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {latestOrder?.map((order) => (
                        <TableRow key={order._id}>
                            <TableHead>{order._id}</TableHead>
                            <TableHead>{order.products.length}</TableHead>
                            <TableHead>{statusBadge(order.status)}</TableHead>
                            <TableHead>{order.totalAmount}</TableHead>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </div>
    )
}

export default LatestOrder
