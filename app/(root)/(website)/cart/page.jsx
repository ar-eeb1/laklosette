'use client'
import WebsiteBreadCrumb from '@/components/Application/Website/WebsiteBreadCrumb'
import { Button } from '@/components/ui/button'
import { WEBSITE_CHECKOUT, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ImgPlaceholder from '@/public/products/41o7qz+iJfL.jpg'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { Delete } from '@mui/icons-material'
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/store/reducer/cartReducer'

const breadCrumb = {
  title: 'Cart',
  links: [
    { label: "Cart" }
  ]
}
const CartPage = () => {
  const dispatch = useDispatch()
  const [mrp, setMrp] = useState(0)
  const [subTotal, setSubTotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const cart = useSelector(store => store.cartStore)
  const [qty, setQty] = useState(1)


  useEffect(() => {
    const cartProducts = cart.products
    const mrps = cartProducts.reduce((sum, product) => sum + (product.mrp * product.qty), 0)
    const totalAmount = cartProducts.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0)
    const discount = cartProducts.reduce((sum, product) => sum + ((product.mrp - product.sellingPrice) * product.qty), 0)
    setMrp(mrps)
    setSubTotal(totalAmount)
    setDiscount(discount)

  }, [cart])


  return (
    <div>
      <WebsiteBreadCrumb props={breadCrumb} />
      {cart.count === 0
        ?
        <div className='w-screen h-[80vh] flex justify-center items-center '>
          <div className='text-center'>
            <h4 className='text-4xl font-semibold mb-5'>Your Cart is Empty</h4>
            <Button type='button' asChild>
              <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
            </Button>
          </div>
        </div>
        :
        <div className='flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4'>
          <div className='lg:w-[70%] w-full'>
            <table className='w-full border'>
              <thead className='border-b bg-gray-50 md:table-header-group hidden'>
                <tr>
                  <th className='text-start p-3'>Product</th>
                  <th className='text-center p-3'>Price</th>
                  <th className='text-center p-3'>Quantity</th>
                  <th className='text-center p-3'>Total</th>
                  <th className='text-center p-3'>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.products.map(product => (
                  <tr key={product.variantId} className='md:table-row block border-b'>
                    <td className='p-3'>
                      <div className='flex items-center gap-5'>
                        <Image
                          src={product.media || ImgPlaceholder.src}
                          width={100}
                          height={100}
                          alt={product.name}
                          className='object-contain'
                        />
                        <div>
                          <h4 className='text-lg underline font-medium line-clamp-1 text-blue-500'><Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>{product.name}</Link></h4>
                          <p className='text-sm'>COLOR : {product.color}</p>
                          <p className='text-sm'>SIZE : {product.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center'>
                      <span className='md:hidden font-medium'>Price</span>
                      <span>
                        {product.sellingPrice.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}
                      </span>
                    </td>
                    <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2 '>
                      <span className='md:hidden font-medium'>Quantity</span>
                      <div className='flex justify-center'>
                        <div className='flex items-center justify-center md:h-10 border rounded-full'>
                          <button type='button' className='h-full w-5 md:w-10 flex justify-center items-center cursor-pointer disabled:bg-gray-500`' disabled={qty === 1} onClick={() => dispatch(decreaseQuantity({ productId: product.productId, variantId: product.variantId }))}>
                            <BiMinus />
                          </button>
                          <input type="text" value={product.qty} className='w-14 text-center border-none outline-offset-0' readOnly />
                          <button type='button' className={`h-full w-5 md:w-10 flex justify-center items-center cursor-pointer`} onClick={() => dispatch(increaseQuantity({ productId: product.productId, variantId: product.variantId }))}>
                            <BiPlus />
                          </button>
                        </div>

                      </div>
                    </td>
                    <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center'>
                      <span className='md:hidden font-medium'>Total Price</span>
                      <span>
                        {(product.sellingPrice * product.qty).toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}
                      </span>
                    </td>
                    <td className='md:table-cell flex md:p-3 justify-between px-3 pb-2 text-center'>
                      <span className='md:hidden font-medium '>Action </span>
                      <button onClick={() => dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))} type='button'><Delete className='text-red-500 cursor-pointer' /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='lg:w-[30%] w-full'>
            <div className='rounded bg-gray-50 p-5 sticky top-5'>
              <h4 className='text-lg font-semibold mb-5'>Order Summary</h4>
              <div>
                <table className='w-full'>
                  <tbody>
                    <tr>
                      <td className='font-medium py-2'>MRP</td>
                      <td className='text-end py-2'>
                        {mrp.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}
                      </td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>Total Discount</td>
                      <td className='text-end py-2'>
                        -{discount.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}
                      </td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>Total Amount</td>
                      <td className='text-end py-2'>
                        {subTotal.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className='flex items-center justify-center flex-col gap-2 mt-10'>
                  <Button type='button' asChild className={`w-fit md:w-full bg-black rounded-full text-white `}>
                    <Link href={WEBSITE_CHECKOUT}>Proceed to checkout</Link>
                  </Button>
                  <p className='text-center'>
                    <Link href={WEBSITE_SHOP} className='hover:underline'>Continue Shopping</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default CartPage
