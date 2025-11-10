'use client'
import Image from 'next/image'
import notFound from '@/public/assets/imagenotfound.png'
import React from 'react'
import Link from 'next/link'
import { WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'

const ProductBox = ({ product }) => {
    return (
        <div className="shadow rounded-lg cursor-pointer hover:scale-105 transition-all duration-150 hover:shadow-2xl overflow-hidden w-full">
            <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
                <div className='relative w-full aspect-[3/4] overflow-hidden group'>
                    <Image
                        src={product?.media?.[0]?.secure_url || notFound.src}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 300px"
                        alt={product?.media?.[0]?.alt || product?.name}
                        title={product?.media?.[0]?.title || product?.name}
                        className="object-cover object-top transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                    />
                    {product?.media?.[1] && (
                        <Image
                            src={product.media[1].secure_url}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 300px"
                            alt={product?.media?.[1]?.alt || product?.name}
                            title={product?.media?.[1]?.title || product?.name}
                            className="object-cover object-top transition-opacity duration-500 opacity-0 group-hover:opacity-100 absolute top-0 left-0"
                        />
                    )}
                </div>

                <div className="p-2 sm:p-3">
                    <div className='flex justify-between items-start w-full gap-2'>
                        <h4 className='text-sm sm:text-base line-clamp-1 flex-1'>{product?.name}</h4>
                        {product.discountPercentage > 0 && (
                            <span className='text-red-500 font-bold text-[10px] sm:text-xs whitespace-nowrap'>
                                {product.discountPercentage}% Off
                            </span>
                        )}
                    </div>
                    <div className='flex gap-1 sm:gap-2 items-center flex-wrap mt-1'>
                        <span className="line-through text-gray-400 text-xs sm:text-sm">
                            Rs {product?.mrp.toLocaleString('en-PK')}
                        </span>
                        <span className="font-semibold text-sm sm:text-base">
                            Rs {product?.sellingPrice.toLocaleString('en-PK')}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductBox