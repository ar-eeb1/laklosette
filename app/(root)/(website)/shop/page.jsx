'use client'
import Filter from '@/components/Application/Website/Filter'
import Sorting from '@/components/Application/Website/Sorting'
import WebsiteBreadCrumb from '@/components/Application/Website/WebsiteBreadCrumb'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import React, { useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import useWindowSize from '@/hooks/useWindowSize'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import ProductBox from '@/components/Application/Website/ProductBox'
import ButtonLoading from '@/components/Application/ButtonLoading'

const breadcrumb = {
    title: 'Shop',
    links: [
        { label: 'Shop', href: WEBSITE_SHOP }
    ]
}

const Shop = () => {
    const searchParams = useSearchParams().toString()
    const [limit, setLimit] = useState(9)
    const [sorting, setSorting] = useState('default_sorting')
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
    const windowSize = useWindowSize()

    const fetchProduct = async (pageParam) => {
        const { data: getProduct } = await axios.get(`/api/shop?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParams}`)

        if (!getProduct.success) {
            return
            // return { products: [], nextPage: null }
        }
        return getProduct.data
    }

    const { error, data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['products', limit, sorting, searchParams],
        queryFn: async ({ pageParam }) => await fetchProduct(pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.nextPage
        }
    })

    return (
        <div>
            <WebsiteBreadCrumb props={breadcrumb} />
            <section className='lg:flex lg:px-32 px-4 my-20'>
                {windowSize.width > 1024 ?
                    <div className='w-72 me-4'>
                        <div className='sticky top-0 bg-gray-50 p-4 rounded'>
                            <Filter />
                        </div>
                    </div>
                    :
                    <Sheet open={isMobileFilterOpen} onOpenChange={() => setIsMobileFilterOpen(false)}>
                        <SheetContent side='left'>
                            <SheetHeader className='border-b '>
                                <SheetTitle>Filter options</SheetTitle>
                            </SheetHeader>
                            <div className='overflow-auto  p-2 h-[calc(100vh-80px)]'>
                                <Filter />
                            </div>
                        </SheetContent>
                    </Sheet>
                }

                <div className='lg:w-[calc(100%-18rem)]'>
                    <Sorting
                        limit={limit}
                        setLimit={setLimit}
                        sorting={sorting}
                        setSorting={setSorting}
                        isMobileFilterOpen={isMobileFilterOpen}
                        setIsMobileFilterOpen={setIsMobileFilterOpen}
                    />
                    {isFetching && <div className='font-semibold p-3 text-center'> Loading... </div>}
                    {error && <div className='font-semibold p-3 text-center'>{error.message}</div>}

                    <div className='grid lg:grid-cols-3 grid-cols-2 lg:gap-10 gap-5'>
                        {data && data.pages.map(page => (
                            page.products.map((product) => (
                                <ProductBox
                                    key={product._id}
                                    product={product}
                                />
                            ))
                        ))}
                    </div>

                    {/* load more button */}
                    <div className='flex justify-center mt-10'>
                        {hasNextPage ?
                            <ButtonLoading type='button' loading={isFetching} text='Load More ' className={'cursor-pointer'} onClick={fetchNextPage} />
                            :
                            <>{!isFetching && <span>Stay tuned for more products</span>}</>
                        }
                    </div>
                </div>

            </section>
        </div>
    )
}

export default Shop
