'use client'
import React, { useEffect, useState } from 'react'
import { BsCart2 } from 'react-icons/bs'
import ImgPlaceholder from '@/public/products/41o7qz+iJfL.jpg'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { Delete } from '@mui/icons-material'
import { removeFromCart } from '@/store/reducer/cartReducer'
import Link from 'next/link'
import { WEBSITE_CART, WEBSITE_CHECKOUT } from '@/routes/WebsiteRoute'
import { Button } from '@/components/ui/button'
import { showToast } from '@/lib/showToast'

const Cart = () => {
    const [open, setOpen] = useState(false)
    const cart = useSelector(store => store.cartStore)
    const dispatch = useDispatch()
    const [subTotal, setSubTotal] = useState(0)
    const [discount, setDiscount] = useState(0)

    useEffect(() => {
        const cartProducts = cart.products
        const totalAmount = cartProducts.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0)
        const discount = cartProducts.reduce((sum, product) => sum + ((product.mrp - product.sellingPrice) * product.qty), 0)
        setSubTotal(totalAmount)
        setDiscount(discount)

    }, [cart])

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger className='relative'>
                    <BsCart2
                        className='text-gray-500 hover:text-primary cursor-pointer'
                        size={25}
                    />
                    <span className='absolute bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center -right-2 -top-1'>{cart.count}</span>
                </SheetTrigger>
                <SheetContent className='sm:max-w-[450px] w-full'>
                    <SheetHeader>
                        <SheetTitle className={`text-2xl`}>My Cart</SheetTitle>
                        <SheetDescription>

                        </SheetDescription>

                        <div className='h-[calc(100vh-40px)] pb-10 flex flex-col justify-between'>
                            <div className='h-[calc(100%-90px)] overflow-auto pe-2'>
                                {cart?.count === 0 &&
                                    <div className='h-full flex items-center justify-center text-xl font-semibold'>
                                        You Cart is Empty</div>}
                                {cart.products?.map(product => (
                                    <div key={product.variantId} className='flex justify-between items-center gap-5 mb-4 border-b pb-4'>
                                        <div className='flex gap-5 items-center'>
                                            <Image src={product?.media || ImgPlaceholder.src} height={100} width={100} alt={product.name} className='shadow w-20 h-20 rounded object-contain' />

                                            <div className=''>
                                                <h4 className='text-lg'>{product.name}</h4>
                                                <p className='text-sm text-gray-500'>{product.size}/{product.color}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <button type='button' className='text-red-400 cursor-pointer underline underline-offset-1 text-xl' onClick={() => dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))}>
                                                <Delete />
                                            </button>
                                            <p className='font-semibold'>
                                                {product.qty} x {product.sellingPrice.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='px-2 h-28 border-t pt-5'>
                                <h2 className='flex justify-between items-center text-lg font-semibold '><span >Subtotal</span> <span>{subTotal.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}</span></h2>
                                <h2 className='flex justify-between items-center text-lg font-semibold '><span >Discount</span> <span>{discount.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}</span></h2>

                                <div className='flex justify-between gap-2 '>
                                    <Button type='button' asChild variant='secondary' className='w-1/2' onClick={() => setOpen(false)} >
                                        <Link href={WEBSITE_CART}>View Cart</Link>
                                    </Button>
                                    <Button type='button' asChild className='w-1/2 ' onClick={() => setOpen(false)}>
                                        {cart.count ?
                                            <Link href={WEBSITE_CHECKOUT}>Checkout</Link>
                                            :
                                            <button type='button' onClick={() => showToast('error', 'Your cart is Empty')}>Checkout</button>
                                        }
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </>
    )
}

export default Cart
