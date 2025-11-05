"use client"
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react'
import React from 'react'
import Image from 'next/image'
import Logo from '@/public/logo.png'
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { zSchema } from '@/lib/zodSchema'
import z from 'zod'
import ButtonLoading from '@/components/Application/ButtonLoading'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { USER_DASHBOARD, WEBSITE_REGISTER, WEBSITE_RESETPASSWORD } from '@/routes/WebsiteRoute';
import axios from 'axios';
import { showToast } from '@/lib/showToast';
import OTPVerification from '@/components/Application/OTPVerification';
import { useDispatch } from 'react-redux';
import { login } from '@/store/reducer/authReducer';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute';

const LoginPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [otpEmail, setOtpEmail] = useState()
  const [isTypePassword, setIsTypePassword] = useState(true)
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false)

  const handleLoginSubmit = async (values) => {
    try {
      setLoading(true)
      const { data: loginResponse } = await axios.post('/api/auth/login', values)
      if (!loginResponse.success) {
        throw new Error(loginResponse.message)
      }
      setOtpEmail(values.email)
      form.reset()
      showToast('success', loginResponse.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  const formSchema = zSchema.pick({
    email: true
  }).extend({
    password: z.string().min('3', "password required")
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      passwword: "",
    },
  })

  // otp verify
  const handleOtpVerification = async (values) => {
     try {
      setOtpVerificationLoading(true)
      const { data: otpResponse } = await axios.post('/api/auth/verify-otp', values)
      if (!otpResponse.success) {
        throw new Error(otpResponse.message)
      }
      setOtpEmail('')
      showToast('success', otpResponse.message)
      
      dispatch(login(otpResponse.data))
      if (searchParams.has('callback')) {
          router.push(searchParams.get('callback'))
      } else {
        otpResponse.data.role === 'admin'? router.push(ADMIN_DASHBOARD):router.push(USER_DASHBOARD)
      }
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setOtpVerificationLoading(false)
    }

  }

  return (
    <Card className="w-[400px] flex items-center shadow-2xl border-2">
      <CardContent>
        <div className='flex justify-center'>
          <Image alt='Image' src={Logo.src} width={Logo.width} height={Logo.height} className='max-w-[150px] animate' />
        </div>
        {!otpEmail
          ?
          <>
            <div className='my-5'>
              <h1 className='text-4xl font-semibold'>Login to your Account</h1>
            </div>
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
                  <div className='mb-3'>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="example@gmail.com" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormLabel>password</FormLabel>
                          <FormControl>
                            <Input type={isTypePassword ? 'password' : 'text'} placeholder="************" {...field} />
                          </FormControl>
                          <button type='button' onClick={() => setIsTypePassword(!isTypePassword)} className='cursor-pointer absolute top-1/2 right-2'>
                            {isTypePassword
                              ? <Eye className='w-4 text-gray-500' />
                              : <EyeOff className='w-4 text-gray-500' />
                            }
                          </button>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mb-3'>
                    <ButtonLoading loading={loading} type="submit" text="LOGIN" className="w-full cursor-pointer " />
                  </div>
                  <div className='text-center flex justify-center gap-x-3' >
                    <p>Don&apos;t have and Account? </p>
                    <Link href={WEBSITE_REGISTER} className='underline text-primary'> Create Account</Link>
                  </div>
                  <div className='text-center'>
                    <Link href={WEBSITE_RESETPASSWORD} className='underline text-primary'>Forget Password</Link>
                  </div>
                </form>
              </Form>
            </div>
          </>
          :
          <>
            <OTPVerification email={otpEmail} loading={otpVerificationLoading} onSubmit={handleOtpVerification} />
          </>
        }

      </CardContent>
    </Card>
  )
}

export default LoginPage
