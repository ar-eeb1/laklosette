'use client'
import React, { use, useEffect, useState } from 'react'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW, ADMIN_PRODUCT_VARIANT_SHOW } from '@/routes/AdminPanelRoute'
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
import slugify from 'slugify'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Application/Select'
import Editor from '@/components/Application/Admin/Editor'
import MediaModal from '@/components/Application/Admin/MediaModal'
import Image from 'next/image'


const BreadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: 'Product Variants' },
  { href: '', label: 'Edit Product Variants' },
]

const EditProduct = ({ params }) => {
  const { id } = use(params)

  const [loading, setLoading] = useState(false)
  const [categoryOption, setCategoryOption] = useState([])
  const { data: getCategory } = useFetch('/api/category?deleteType=SD&&size=10000')
  const { data: getProduct, loading: getProductLoading } = useFetch(`/api/product-variant/get/${id}`)

  useEffect(() => {
    if (getCategory && getCategory.success) {
      const data = getCategory.data
      const options = data.map((cat) => ({ label: cat.name, value: cat._id }))
      setCategoryOption(options)
    }
  }, [getCategory])

  // const editor = (event, editor) => {
  //   const data = editor.getData()
  //   form.setValue('description', data)
  // }

  const formSchema = zSchema.pick({
    _id: true,
    name: true,
    slug: true,
    category: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
    // description: true,
    product: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      name: '',
      product: '',
      slug: '',
      category: '',
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      // description: '',
    }
  })

  useEffect(() => {
    if (getProduct && getProduct.success) {
      const product = getProduct.data
      form.reset({
        _id: product?._id,
        name: product.product?.name,
        product: product.product?._id,
        slug: product.product?.slug,
        category: product.product?.category,
        mrp: product?.mrp,
        sellingPrice: product?.sellingPrice,
        discountPercentage: product?.discountPercentage,
        // description: product?.description,
      })

      if (product.media) {
        const media = product.media.map((media) => ({ _id: media._id, url: media.secure_url }))
        setSelectedMedia(media)
      }
    }
  }, [getProduct])


  const onSubmit = async (values) => {
    setLoading(true)
    try {
      if (selectedMedia.length < 0) {
        return showToast('error', 'Select Media')
      }
      const mediaIds = selectedMedia.map(media => media._id)
      values.media = mediaIds
      values.product = form.getValues('product')
      const { data: response } = await axios.put('/api/product-variant/update', values)
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
  // media modalstates
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  useEffect(() => {
    const name = form.getValues('name')
    if (name) {
      form.setValue('slug', slugify(name).toLowerCase())
    }
  }, [form.watch('name')])

  // discount calculate
  useEffect(() => {
    const mrp = form.getValues('mrp') || 0
    const sellingPrice = form.getValues('sellingPrice') || 0
    if (mrp > 0 && sellingPrice > 0) {
      const discounted = ((mrp - sellingPrice) / mrp) * 100
      form.setValue('discountPercentage', Math.round(discounted))
    }

  }, [form.watch('mrp'), form.watch('sellingPrice')])


  return (
    <div>
      <BreadCrumb BreadcrumbData={BreadcrumbData} />
      <Card className='py-0 shadow-sm'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <h4 className='text-xl font-semibold'>Edit Product Variant</h4>
        </CardHeader>
        <CardContent>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>


              <div className='grid md:grid-cols-2 gap-5'>

                <div className='mb-3'>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (fixed) <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter category name" {...field} readOnly/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='mb-3'>
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (fixed) <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter Slug" {...field} readOnly/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='mb-3'>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Select
                            options={categoryOption}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='mb-3'>
                  <FormField
                    control={form.control}
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MRP <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter MRP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='mb-3'>
                  <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter Selling Price" {...field} />
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
                          <Input type="number" readOnly placeholder="Enter Discount Percentage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* <div className='mb-3 md:col-span-2'>
                  <FormLabel className='mb-2'>Description <span className='text-red-500'>*</span></FormLabel>
                  {!getProductLoading &&
                    <Editor onChange={editor} initialData={form.getValues('description')} />
                  }
                  <FormMessage></FormMessage>
                </div> */}

              </div>

              <div className='flex flex-col items-center'>
                <div className='md:col-span-2 border rounded p-5 text-center flex justify-center  '>
                  <MediaModal
                    open={open}
                    setOpen={setOpen}
                    selectedMedia={selectedMedia}
                    setSelectedMedia={setSelectedMedia}
                    isMultiple={true}
                  />
                  {selectedMedia.length > 0
                    &&
                    <div className='flex justify-center items-center flex-wrap mb-3 gap-2 '>
                      {selectedMedia.map(media => (
                        <div className='h-24 w-24 border' key={media._id}>
                          {<Image
                            src={media.url}
                            alt={media.alt || ''}
                            width={300}
                            height={300}
                            className='size-full object-cover'
                          />}
                        </div>
                      ))}
                    </div>}

                </div>
                <div onClick={() => setOpen(true)} className=' dark:bg-card border w-[200px] py-2 cursor-pointer text-center mt-4 bg-primary rounded-md '>
                  <span className='font-semibold'>Select Media</span>
                </div>
              </div>

              <div className='mb-3 mt-3 w-full'>
                <ButtonLoading loading={loading} type="submit" text="Update Product" className="text-center cursor-pointer" />
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditProduct
