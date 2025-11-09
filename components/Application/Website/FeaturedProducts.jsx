import axios from 'axios'
import Link from 'next/link'
import React from 'react'
import { FaChevronRight } from 'react-icons/fa'
import ProductBox from './ProductBox'

const FeaturedProducts = async () => {
    let productData = null
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/get-featured-product`)
        productData = data
    } catch (error) {
        console.log(error);
        
    }

    if (!productData) return null
    return (

        <section className='lg:px-32 px-4 sm:py-10'>
            <div className='flex justify-between items-center mb-5 '>
                <h2 className='sm:text-4xl font-semibold text-2xl'>Featured Products</h2>
                <Link href="" className='flex gap-4 items-center underline underline-offset-4 hover:text-primary'>
                    View All <FaChevronRight />
                </Link>
            </div>
            <div className='grid sm:grid-cols-4 grid-cols-2 sm:gap-10 gap-2'>
                {!productData.success && <div className='text-center py-5 text-gray-600'>Data not found</div>}
                {productData.success && productData.data.map((product) => (
                    <ProductBox key={product._id} product={product} />
                ))}
            </div>
        </section>
    )
}

export default FeaturedProducts
