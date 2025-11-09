'use client'
import ButtonLoading from '@/components/Application/ButtonLoading'
import Loading from '@/components/Application/Loading'
import WebsiteBreadCrumb from '@/components/Application/Website/WebsiteBreadCrumb'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { WEBSITE_ORDER_DETAILS, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { addIntoCart, clearCart } from '@/store/reducer/cartReducer'
import { zodResolver } from '@hookform/resolvers/zod'
import { Delete } from '@mui/icons-material'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaShippingFast } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import z, { success } from 'zod'
import loading from '@/public/assets/loading.svg'

const breadCrumb = {
  title: 'Checkout',
  links: [
    { label: "Checkout" }
  ]
}

const Checkout = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const cart = useSelector(store => store.cartStore)
  const authStore = useSelector(store => store.authStore)
  const [verifiedCartData, setVerifiedCartData] = useState([])
  const { data: getVerifiedCartData } = useFetch('/api/cart-verification', 'POST', { data: cart.products })

  const [isCouponApplied, setIsCouponApplied] = useState(false)
  const [subTotal, setSubTotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [mrp, setMrp] = useState(0)
  const [couponCode, setCouponCode] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)

  useEffect(() => {
    const cartProducts = cart.products
    const subTotalAmount = cartProducts.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0)
    const discount = cartProducts.reduce((sum, product) => sum + ((product.mrp - product.sellingPrice) * product.qty), 0)
    const mrpPrice = cartProducts.reduce((sum, product) => sum + (product.mrp * product.qty), 0)

    setSubTotal(subTotalAmount)
    setMrp(mrpPrice)
    setDiscount(discount)
    setTotalAmount(subTotalAmount)

    couponForm.setValue('minShoppingAmount', subTotalAmount)

  }, [cart])


  useEffect(() => {
    if (getVerifiedCartData && getVerifiedCartData.success) {
      const cartData = getVerifiedCartData.data
      setVerifiedCartData(cartData)
      dispatch(clearCart())

      cartData.forEach(cartItem => {
        dispatch(addIntoCart(cartItem))
      });
    }
  }, [getVerifiedCartData])

  //coupon form
  const couponFormSchema = zSchema.pick({
    code: true,
    minShoppingAmount: true,
  })

  const couponForm = useForm({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      minShoppingAmount: subTotal
    }
  })

  const applyCoupon = async (values) => {
    setCouponLoading(true)
    try {
      const { data: response } = await axios.post('/api/coupon/apply', values)
      if (!response.success) {
        throw new Error(response.message)
      }
      const discountPercentage = response.data.discountPercentage

      // get coupon discount amount
      setCouponDiscountAmount((subTotal * discountPercentage) / 100)
      setTotalAmount(subTotal - ((subTotal * discountPercentage) / 100))
      setCouponCode(couponForm.getValues('code'))
      setIsCouponApplied(true)
      showToast('success', response.message)

      couponForm.resetField('code', '')
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setIsCouponApplied(false)
    setCouponCode('')
    setCouponDiscountAmount(0)
    setTotalAmount(subTotal)
  }

  //place order
  const orderFormSchema = zSchema.pick({
    name: true,
    email: true,
    phone: true,
    country: true,
    state: true,
    city: true,
    pincode: true,
    landmark: true,
    ordernote: true,
  }).extend({
    userId: z.string().optional()
  })

  const orderForm = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country: 'Pakistan',
      state: '',
      city: '',
      pincode: '',
      landmark: '',
      ordernote: '',
      userId: authStore?.auth?._id,
    }
  })

  useEffect(() => {
    if (authStore) {
      orderForm.setValue('userId', authStore?.auth?._id)
    }
  }, [authStore])


  // get order id
  const getOrderId = async (amount) => {
    try {
      const { data: oid } = await axios.post('/api/payment/get-order-id', { amount });

      showToast('success', 'Order id Created')
      return oid;
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // place order
  const placeOrder = async (formData) => {
    try {
      setPlacingOrder(true)
      const generateOrderId = await getOrderId(totalAmount)
      if (!generateOrderId.success) {
        throw new Error(generateOrderId.message)
      }

      const order_id = generateOrderId.order_id
      const products = verifiedCartData.map((cartItem) => (
        {
          productId: cartItem.productId,
          variantId: cartItem.variantId,
          name: cartItem.name,
          qty: cartItem.qty,
          mrp: cartItem.mrp,
          sellingPrice: cartItem.sellingPrice,
        }
      ))
      setSavingOrder(true)

      const { data: paymentResponseData } = await axios.post('/api/payment/save-order', {
        ...formData,
        order_id: order_id,
        products: products,
        subtotal: subTotal,
        discount: discount,
        couponDiscountAmount: couponDiscountAmount,
        totalAmount, totalAmount
      })

      if (paymentResponseData.success) {
        showToast('success', paymentResponseData.message)
        dispatch(clearCart())
        orderForm.reset()
        router.push(WEBSITE_ORDER_DETAILS(paymentResponseData.data.order_id))
        setSavingOrder(false)
      } else {
        showToast('error', paymentResponseData.message)
        setSavingOrder(false)
      }

    } catch (error) {
      showToast('error', error.message)
    } finally {
      setPlacingOrder(false)
    }
  }


  return (
    <div>
      <WebsiteBreadCrumb props={breadCrumb} />

      {savingOrder &&
        <div className='h-screen w-screen fixed top-0 left-0 z-50 bg-white/80'>
          <div className='h-screen flex justify-center items-center mt-20'>
            <Image src={loading.src} alt='loading' width={80} height={80} className='animate-spin' />
            <h4>Order Confirming...</h4>
          </div>
        </div>
      }
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
          <div className='lg:w-[60%] w-full'>
            <div className='flex font-semibold gap-2 items-center'>
              <FaShippingFast size={30} /> Shipping Details
            </div>
            <div className='mt-5'>
              <Form {...orderForm}>
                <form className='grid grid-cols-2 gap-5' onSubmit={orderForm.handleSubmit(placeOrder)}>

                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder='Enter Your Full Name*' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >
                    </FormField>
                  </div>

                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="email" placeholder='Enter Your Email*' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >
                    </FormField>
                  </div>

                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='phone'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder='Enter Your Phone Number*' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >
                    </FormField>
                  </div>

                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='country'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder='Enter Your Country' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >
                    </FormField>
                  </div>

                  <div className="mb-3">
                    <FormField
                      control={orderForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem >
                          <FormControl >
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className={`w-full`}>
                                <SelectValue placeholder="Select your State" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sindh">Sindh</SelectItem>
                                <SelectItem value="punjab">Punjab</SelectItem>
                                <SelectItem value="kpk">Khyber Pakhtunkhwa (KPK)</SelectItem>
                                <SelectItem value="balochistan">Balochistan</SelectItem>
                                <SelectItem value="gilgit">Gilgit-Baltistan</SelectItem>
                                <SelectItem value="ajk">Azad Jammu & Kashmir</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>


                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='city'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder='Enter Your City' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >
                    </FormField>
                  </div>

                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='pincode'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder='Enter Your ZIP Code' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >
                    </FormField>
                  </div>

                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='landmark'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder='Enter Your complete Address' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >
                    </FormField>
                  </div>

                  <div className='mb-3 col-span-2'>
                    <FormField
                      control={orderForm.control}
                      name='ordernote'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder='Enter Your Order Note' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >
                    </FormField>
                  </div>
                  <div>
                    <ButtonLoading loading={placingOrder} type='submit' text='Submit Order' className='bg-black rounded-full px-5 cursor-pointer text-white' />
                  </div>

                </form>
              </Form>
            </div>
          </div>

          <div className='lg:w-[40%] w-full'>
            <div className='rounded bg-gray-50 p-5 sticky top-5'>
              <h4 className='text-lg font-semibold mb-5'>Order Summary</h4>
              <div>
                <table className='w-full border'>
                  <tbody>
                    {verifiedCartData && verifiedCartData?.map(product => (
                      <tr key={product.variantId}>
                        <td className='p-3'>
                          <div className='flex items-center gap-5'>
                            <Image
                              src={product.media}
                              width={60}
                              height={60}
                              alt={product.name}
                              className='rounded shadow'
                            />
                            <div>
                              <h4 className='font-medium line-clamp-1 '>
                                <Link className='text-blue-500 underline' href={WEBSITE_PRODUCT_DETAILS(product.url)}>
                                  {product.name}
                                </Link>
                              </h4>
                              <p className='text-xs'>COLOR : {product.color}</p>
                              <p className='text-xs'>SIZE : {product.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className='p-3 text-center'>
                          <p className='text-nowrap text-sm'>
                            {product.qty} x {product.sellingPrice.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                        - {discount.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}

                      </td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>Coupon Discount</td>
                      <td className='text-end py-2'>
                        - {couponDiscountAmount.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}

                      </td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2 text-xl'>Total Amount</td>
                      <td className='text-end py-2'>
                        {totalAmount.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}

                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className='mt-2 mb-5'>
                  {!isCouponApplied ?
                    <Form {...couponForm}>
                      <form className='flex justify-between gap-3' onSubmit={couponForm.handleSubmit(applyCoupon)}>
                        <div className='w-[calc(100%-100px)] '>
                          <FormField
                            control={couponForm.control}
                            name='code'
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder='Enter Coupon Code' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          >
                          </FormField>
                        </div>
                        <div className='w-[100px]'>
                          <ButtonLoading type="submit" text="apply" className="w-full cursor-pointer" loading={couponLoading} />
                        </div>
                      </form>
                    </Form>
                    :
                    <div className='flex justify-between py-1 px-5 rounded-lg bg-gray-200 '>
                      <div>
                        <span className='text-xs font-semibold'>Coupon : </span>
                        <p className='text=sim font-semibold'>{couponCode}</p>
                      </div>
                      <button onClick={removeCoupon} type='buton' className='text-red-500 cursor-pointer'><Delete size={25} /></button>
                    </div>
                  }
                </div>

              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Checkout
