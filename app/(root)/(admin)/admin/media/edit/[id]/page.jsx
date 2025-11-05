'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { zSchema } from '@/lib/zodSchema'
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import notFound from '@/public/assets/notFound.jpg'
import { showToast } from '@/lib/showToast'
import axios from 'axios'

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: 'Home'
  },
  {
    href: ADMIN_MEDIA_SHOW,
    label: 'Media'
  },
  {
    label: 'Edit Media'
  },
]

const EditMedia = ({ params }) => {
  const { id } = use(params)
  const { data: mediaData } = useFetch(`/api/media/get/${id}`)
  const [loading, setLoading] = useState(false)

  const formSchema = zSchema.pick({
    _id: true,
    alt: true,
    title: true
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      alt: "",
      title: "",
    },
  })

  const onSubmit = async (values) => {
    try {
      setLoading(true)
      const { data: response } = await axios.put('/api/media/update', values)
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

  useEffect(() => {
    if (mediaData && mediaData.success) {
      const data = mediaData.data
      form.reset({
        _id: data._id,
        alt: data.alt,
        title: data.title
      })
    }
  }, [mediaData])


  return (
    <div className='mt-20'>
      <BreadCrumb BreadcrumbData={breadCrumbData} />

      <Card className='py-0 shadow-sm'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <h4 className='text-xl font-semibold'>Edit Media</h4>
        </CardHeader>
        <CardContent>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='mb-3'>
                <Image
                  src={mediaData?.data?.secure_url || notFound}
                  width={400}
                  height={400}
                  alt={mediaData?.alt || 'Image'}
                />
                <FormField
                  control={form.control}
                  name="alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>alt</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter Alt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='mb-3'>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='mb-3 w-full'>
                <ButtonLoading loading={loading} type="submit" text="Update Media" className="text-center cursor-pointer " />
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditMedia
