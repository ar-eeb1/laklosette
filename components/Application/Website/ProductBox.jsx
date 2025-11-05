'use client'
import Image from 'next/image'
import notFound from '@/public/assets/imagenotfound.png'
import React from 'react'
import Link from 'next/link'
import { WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'

const ProductBox = ({ product }) => {

    return (
        <div className="shadow rounded-lg cursor-pointer hover:scale-105 transition-all duration-150 hover:shadow-2xl overflow-hidden">
            <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
                <div className="relative lg:w-[400px] lg:h-[350px]  md:w-[200px] md:h-[200px] h-[100px] w-[100px] overflow-hidden group object-top ">
                    <Image
                        src={product?.media?.[0]?.secure_url || notFound.src}
                        width={400}
                        height={400}
                        alt={product?.media?.[0]?.alt || product?.name}
                        title={product?.media?.[0]?.title || product?.name}
                        className="w-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0 object-top"
                    />

                    {product?.media?.[1] && (
                        <Image
                            src={product.media[1].secure_url}
                            width={400}
                            height={400}
                            alt={product?.media?.[1]?.alt || product?.name}
                            title={product?.media?.[1]?.title || product?.name}
                            className="w-full object-cover  transition-opacity duration-500 opacity-0 group-hover:opacity-100 absolute top-0 left-0"
                        />
                    )}

                </div>

                <div className="p-3 ">
                    <div className='flex justify-between  w-full'>
                        <h4 className=''>{product?.name}</h4>
                        <span className='text-end text-red-500 font-bold animate-pulse delay-100 text-[12px]'>{product.discountPercentage}% Off</span>
                    </div>
                    <p className='flex gap-2 items-start '>
                        <span className="line-through text-gray-400 mr-2">{product?.mrp.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span>
                        <span className="font-semibold">{product?.sellingPrice.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</span>
                    </p>
                </div>
            </Link>
        </div>
    )
}

export default ProductBox
