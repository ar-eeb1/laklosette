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
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute';
import axios from 'axios';
import { showToast } from '@/lib/showToast';
import OTPVerification from '@/components/Application/OTPVerification';
import { catchError } from '@/lib/helperFunction';
import UpdatePassword from '@/components/Application/UpdatePassword';


const ResetPassword = () => {
    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false)
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false)
    const [otpEmail, setOtpEmail] = useState()
    const [isOtpVerified, setIsOtpVerified] = useState(false)
    const formSchema = zSchema.pick({
        email: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    })

    const handleEmailVerification = async (values) => {
        try {
            setEmailVerificationLoading(true)
            const { data: sendOtpResponse } = await axios.post('/api/auth/reset-password/send-otp', values)
            if (!sendOtpResponse.success) {
                throw new Error(sendOtpResponse.message)
            }
            setOtpEmail(values.email)
            showToast('success', sendOtpResponse.message)

        } catch (error) {
            catchError(error)
        } finally {
            setEmailVerificationLoading(false)
        }
    }
    //OTP VERIFICATION 
    const handleOtpVerification = async (values) => {
        try {
            setOtpVerificationLoading(true)
            const { data: otpResponse } = await axios.post('/api/auth/reset-password/verify-otp', values)
            if (!otpResponse.success) {
                throw new Error(otpResponse.message)
            }
            showToast('success', otpResponse.message)
            setIsOtpVerified(true)
        } catch (error) {
            catchError(error)
        } finally {
            setOtpVerificationLoading(false)
        }
    }

    return (
        <div>
            <Card className=" flex items-center shadow-2xl border-2">
                <CardContent>
                    {!otpEmail
                        ?
                        <>
                            <div className='my-5'>
                                <h1 className='text-4xl font-semibold'>Reset Password</h1>
                                <p>Enter Your email for resetting your password</p>
                            </div>
                            <div>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleEmailVerification)}>
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
                                            <ButtonLoading loading={emailVerificationLoading} type="submit" text="SEND OTP" className="w-full cursor-pointer " />
                                        </div>

                                        <div className='text-center'>
                                            <Link href={WEBSITE_LOGIN} className='underline text-primary'>Back to Login</Link>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </>
                        :
                        <>
                            {!isOtpVerified ?
                                <OTPVerification email={otpEmail} loading={otpVerificationLoading} onSubmit={handleOtpVerification} />
                                :
                                <UpdatePassword email={otpEmail}/>
                            }
                        </>
                    }

                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPassword
