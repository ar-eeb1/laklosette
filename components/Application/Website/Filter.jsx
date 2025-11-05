'use client'
import useFetch from '@/hooks/useFetch'
import React, { useEffect, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import ButtonLoading from '../ButtonLoading'
import { useRouter, useSearchParams } from 'next/navigation'
import { WEBSITE_HOME, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Filter = () => {

    const searchParams = useSearchParams()

    const { data: categoryData } = useFetch('/api/category/get-category')
    const { data: colorData } = useFetch('/api/product-variant/colors')
    const { data: sizeData } = useFetch('/api/product-variant/size')

    const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: 0 })
    const [selectedCategory, setSelectedCategory] = useState([])
    const [selectedColor, setSelectedColor] = useState([])
    const [selectedSize, setSelectedSize] = useState([])

    const urlSearchParams = new URLSearchParams(searchParams.toString())
    const router = useRouter()

    useEffect(() => {
        searchParams.get('category') ? setSelectedCategory(searchParams.get('category').split(',')) : setSelectedCategory([]);
        searchParams.get('color') ? setSelectedColor(searchParams.get('color').split(',')) : setSelectedColor([]);
        searchParams.get('size') ? setSelectedSize(searchParams.get('size').split(',')) : setSelectedSize([]);

    }, [searchParams])


    const handlePriceChange = (value) => {
        setPriceFilter({ minPrice: value[0], maxPrice: value[1] })
    }

    const handleCategoryFilter = (categorySlug) => {
        let newSelectedCategory = [...selectedCategory]
        if (newSelectedCategory.includes(categorySlug)) {
            newSelectedCategory = newSelectedCategory.filter(cat => cat !== categorySlug)
        } else {
            newSelectedCategory.push(categorySlug)
        }

        setSelectedCategory(newSelectedCategory)
        newSelectedCategory.length > 0 ? urlSearchParams.set('category', newSelectedCategory.join(',')) : urlSearchParams.delete('category')
        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    const handleColorFilter = (color) => {
        let newSelectedColor = [...selectedColor]
        if (newSelectedColor.includes(color)) {
            newSelectedColor = newSelectedColor.filter(col => col !== color)
        } else {
            newSelectedColor.push(color)
        }

        setSelectedColor(newSelectedColor)
        newSelectedColor.length > 0 ? urlSearchParams.set('color', newSelectedColor.join(',')) : urlSearchParams.delete('color')
        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    const handleSizeFilter = (size) => {
        let newSelectedSize = [...selectedSize]
        if (newSelectedSize.includes(size)) {
            newSelectedSize = newSelectedSize.filter(cat => cat !== size)
        } else {
            newSelectedSize.push(size)
        }

        setSelectedSize(newSelectedSize)
        newSelectedSize.length > 0 ? urlSearchParams.set('size', newSelectedSize.join(',')) : urlSearchParams.delete('size')
        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    const handlePriceFilter = () => {
        urlSearchParams.set('minPrice', priceFilter.minPrice)
        urlSearchParams.set('maxPrice', priceFilter.maxPrice)
        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    return (
        <div>
            {
                searchParams.size > 0 &&
                <div className='my-2 mx-2'>
                    <Button variant='destructive' type="button" asChild className='w-full border-red-500 cursor-pointer' >
                        <Link href={WEBSITE_SHOP}>
                            Reset Filters
                        </Link>
                    </Button>
                </div>
            }
            <Accordion type="multiple" defaultValue={["1", "2", "3", "4"]} >
                <AccordionItem value="1">
                    <AccordionTrigger className='uppercase font-semibold hover:no- pl-3 '>Category</AccordionTrigger>
                    <AccordionContent className='pl-3'>
                        <div className='max-h-48 overflow-auto'>
                            <ul>
                                {categoryData && categoryData.success && categoryData.data.map((category) => (
                                    <li key={category._id} className='mb-3'>
                                        <label className='flex items-center space-x-3 cursor-pointer'>
                                            <Checkbox
                                                onCheckedChange={() => handleCategoryFilter(category.slug)}
                                                checked={selectedCategory.includes(category.slug)}
                                            />
                                            <span>{category.name}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="2">
                    <AccordionTrigger className='uppercase font-semibold hover:no- pl-3 '>color</AccordionTrigger>
                    <AccordionContent className='pl-3'>
                        <div className='max-h-48 overflow-auto'>
                            <ul>
                                {colorData && colorData.success && colorData.data.map((color) => (
                                    <li key={color} className='mb-3'>
                                        <label className='flex items-center space-x-3 cursor-pointer'>
                                            <Checkbox
                                                onCheckedChange={() => handleColorFilter(color)}
                                                checked={selectedColor.includes(color)}
                                            />
                                            <span>{color}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="3">
                    <AccordionTrigger className='uppercase font-semibold hover:no- pl-3 '>size</AccordionTrigger>
                    <AccordionContent className='pl-3'>
                        <div className='max-h-48 overflow-auto'>
                            <ul>
                                {sizeData && sizeData.success && sizeData.data.map((size) => (
                                    <li key={size} className='mb-3'>
                                        <label className='flex items-center space-x-3 cursor-pointer'>
                                            <Checkbox
                                                onCheckedChange={() => handleSizeFilter(size)}
                                                checked={selectedSize.includes(size)}
                                            />
                                            <span>{size}</span>
                                        </label>
                                    </li>
                                ))}


                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>




                <AccordionItem value="4">
                    <AccordionTrigger className='uppercase font-semibold hover:no- pl-3 '>
                        Price
                    </AccordionTrigger>
                    <AccordionContent className='pl-3 pt-5'>
                        <Slider defaultValue={[0, 5000]} onValueChange={handlePriceChange} max={5000} step={1} />
                        <div className='flex justify-between px-3'>
                            <div className='mt-3'>{priceFilter.minPrice.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}</div>
                            <div className='mt-3'>{priceFilter.maxPrice.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}</div>
                        </div>

                        <div className='mt-2'>
                            <ButtonLoading type="button" text="Filter Price" className='cursor-pointer' onClick={handlePriceFilter} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div >
    )
}

export default Filter
