import { zSchema } from '@/lib/zodSchema'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import ButtonLoading from './ButtonLoading'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { zodResolver } from '@hookform/resolvers/zod'
import { showToast } from '@/lib/showToast'
import axios from 'axios'

const OTPVerification = ({ email, onSubmit, loading }) => {
    const [isResendingOtp, setIsResendingOtp] = useState(false)

    const formSchema = zSchema.pick({
        otp: true, email: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
            email: email,
        }
    })

    const handleOtpVerification = async (values) => {
        onSubmit(values)
    }

    const resendOTP = async () => {
        try {
            setIsResendingOtp(true)
            const { data: resendOtpResponse } = await axios.post('/api/auth/resend-otp', { email })
            if (!resendOtpResponse.success) {
                throw new Error(resendOtpResponse.message)
            }
            showToast('success', resendOtpResponse.message)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setIsResendingOtp(false)
        }
    }

    return (
        <Form  {...form}>
            <form className='' onSubmit={form.handleSubmit(handleOtpVerification)}>
                <div className='text-center'>
                    <h1 className='text-2xl font-bold mb-2'>Please complete verification</h1>
                    <p className='text-md '>We sent an OTP to your registered email.</p>
                </div>
                <div className='mb-3 flex items-center justify-center'>
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel></FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='mb-3'>
                    <ButtonLoading loading={loading} type="submit" text="VERIFY OTP" className="w-full cursor-pointer " />
                    <div className='mt-2 text-center'>
                        {isResendingOtp ? (
                            <button type="button" disabled className="text-gray-500 text-sm cursor-not-allowed">Resending...</button>
                        ) : (
                            <button type="button" onClick={resendOTP} className="text-blue-500 text-sm hover:underline cursor-pointer">Resend OTP</button>
                        )}
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default OTPVerification
