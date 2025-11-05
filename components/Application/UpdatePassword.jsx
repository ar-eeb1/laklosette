"use client"
import { Card, CardContent } from '@/components/ui/card'
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
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { showToast } from '@/lib/showToast';
import { useRouter } from 'next/navigation';
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute';

const UpdatePassword = ({ email }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isTypePassword, setIsTypePassword] = useState(true)
    const [isTypeConfirmPassword, setIsTypeConfirmPassword] = useState(true)
    const formSchema = zSchema.pick({
        email: true, password: true,
    }).extend({
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords not matched",
        path: ['confirmPassword']
    })

    const handlePasswordUpdate = async (values) => {
        try {
            setLoading(true)
            const { data: passwordUpdate } = await axios.put('/api/auth/reset-password/update-password', values)

            if (!passwordUpdate.success) {
                alert(passwordUpdate.message)
                throw new Error(passwordUpdate.message)
            }

            form.reset()
            showToast('success', passwordUpdate.message)
            router.push(WEBSITE_LOGIN)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }



    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email,
            password: "",
            confirmPassword: "",
        },
    })

    return (
        <div className="">
            <div className='flex justify-center'>
                <Image alt='Image' src={Logo.src} width={Logo.width} height={Logo.height} className='max-w-[150px] animate' />
            </div>
            <div className='my-5'>
                <h1 className='text-4xl font-semibold'>Update Password</h1>
                <p>Create your new password</p>
            </div>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handlePasswordUpdate)}>

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
                            <ButtonLoading loading={loading} type="submit" text="Update Password" className="w-full cursor-pointer " />
                        </div>

                    </form>
                </Form>
            </div>
        </div>
    )
}

export default UpdatePassword
