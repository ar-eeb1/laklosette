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
import axios from 'axios';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute';
import { showToast } from '@/lib/showToast';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false)
  const [isTypePassword, setIsTypePassword] = useState(true)
  const [isTypeConfirmPassword, setIsTypeConfirmPassword] = useState(true)

  const handleRegisterSubmit = async (values) => {
    try {
      setLoading(true)

      const { data: registerResponse } = await axios.post('/api/auth/register', values)

      if (!registerResponse.success) {
        alert(registerResponse.message)
        throw new Error(error.message)
      }

      form.reset()
      showToast('success', registerResponse.message)
    } catch (error) {
      showToast('error', registerResponse.message)
    } finally {
      setLoading(false)
    }
  }

  const formSchema = zSchema.pick({
    name: true,
    email: true,
    password: true,
  }).extend({
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords not matched",
    path: ['confirmPassword']
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  return (
    <Card className="w-[400px] flex text-center shadow-2xl border-2">
      <CardContent className="">
        <div className='flex justify-center'>
          <Image alt='Image' src={Logo.src} width={Logo.width} height={Logo.height} className='max-w-[150px] animate' />
        </div>
        <div className='my-5'>
          <h1 className='text-4xl font-semibold'>Create Account</h1>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegisterSubmit)}>

              {/* Name Field */}
              <div className='mb-3'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email Field */}
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

              {/* Password Field */}
              <div className='mb-3'>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type={isTypePassword ? 'password' : 'text'} placeholder="************" {...field} />
                      </FormControl>
                      <button
                        type='button'
                        onClick={() => setIsTypePassword(!isTypePassword)}
                        className='cursor-pointer absolute top-1/2 right-2'
                      >
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

              {/* Confirm Password Field */}
              <div className='mb-3'>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type={isTypeConfirmPassword ? 'password' : 'text'} placeholder="************" {...field} />
                      </FormControl>
                      <button
                        type='button'
                        onClick={() => setIsTypeConfirmPassword(!isTypeConfirmPassword)}
                        className='cursor-pointer absolute top-1/2 right-2'
                      >
                        {isTypeConfirmPassword
                          ? <Eye className='w-4 text-gray-500' />
                          : <EyeOff className='w-4 text-gray-500' />
                        }
                      </button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit */}
              <div className='mb-3'>
                <ButtonLoading loading={loading} type="submit" text="REGISTER" className="w-full cursor-pointer " />
              </div>

              {/* Links */}
              <div className='text-center flex justify-center gap-x-3' >
                <p>Already have an account?</p>
                <Link href={WEBSITE_LOGIN} className='underline text-primary'>Login</Link>
              </div>
              <div className='text-center'>
                <Link href="" className='underline text-primary'>Forgot Password</Link>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}

export default RegisterPage
