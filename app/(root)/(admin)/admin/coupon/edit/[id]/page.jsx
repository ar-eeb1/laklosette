'use client'
import React, { use, useEffect, useState } from 'react'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_COUPON_SHOW, ADMIN_DASHBOARD} from '@/routes/AdminPanelRoute'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import dayjs from 'dayjs'


const BreadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_COUPON_SHOW, label: 'Coupons' },
  { href: '', label: 'Edit Coupon' },
]

const EditCoupon = ({ params }) => {
  const { id } = use(params)

  const [loading, setLoading] = useState(false)
  const { data: getCoupon, loading: getCouponLoading } = useFetch(`/api/coupon/get/${id}`)

  const editor = (event, editor) => {
    const data = editor.getData()
  }

  const formSchema = zSchema.pick({
    _id: true,
    code: true,
    discountPercentage: true,
    minShoppingAmount: true,
    validity: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      code: '',
      discountPercentage: '',
      minShoppingAmount: '',
      validity: 0,
    }
  })

  useEffect(() => {
    if (getCoupon && getCoupon.success) {
      const coupon = getCoupon.data
      form.reset({
        _id: coupon?._id,
        code: coupon?.code,
        discountPercentage: coupon?.discountPercentage,
        minShoppingAmount: coupon?.minShoppingAmount,
        // validity: coupon?.validity,
        validity: dayjs(coupon.validity).format("YYYY-MM-DD")
      })

    }
  }, [getCoupon])


  const onSubmit = async (values) => {
    setLoading(true)
    try {

      const { data: response } = await axios.put('/api/coupon/update', values)
      if (!response.success) {
        throw new Error(response.message)
      }

      showToast('success', response.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div>
      <BreadCrumb BreadcrumbData={BreadcrumbData} />
      <Card className='py-0 shadow-sm'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <h4 className='text-xl font-semibold'>Edit Coupon</h4>
        </CardHeader>
        <CardContent>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>


              <div className='grid md:grid-cols-2 gap-5'>

                <div className='mb-3'>
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Code <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter coupon code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


                <div className='mb-3'>
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Percentage <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter Discount Percentage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='mb-3'>
                  <FormField
                    control={form.control}
                    name="minShoppingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Shopping Amount <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter Min Shopping Amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='mb-3'>
                  <FormField
                    control={form.control}
                    name="validity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validity<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>



              </div>



              <div className='mb-3 mt-3 w-full'>
                <ButtonLoading loading={loading} type="submit" text="Update Coupon" className="text-center cursor-pointer" />
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditCoupon
