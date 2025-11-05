'use client'
import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
import { useState, useEffect } from 'react'
import failedImg from '@/public/assets/failed.gif'
import Image from 'next/image'
import passImg from '@/public/assets/pass.gif'
import React, { use } from 'react'
import { Button } from '@/components/ui/button'
import { WEBSITE_HOME } from '@/routes/WebsiteRoute'
import Link from 'next/link'

const EmailVerification = ({ params }) => {
    const { token } = use(params)
    const [isVerified, setIsVerified] = useState(null)
    useEffect(() => {
        const verify = async () => {
            const { data: verificationResponse } = await axios.post('/api/auth/verify-email', { token })

            if (verificationResponse.success) {
                setIsVerified(true)
            }
        }
        verify()
    }, [token])

    return (

        <div className="flex items-center justify-center min-h-screen">
            <Card>
                <CardContent>
                    {isVerified === null ? (
                        <h1 className="text-xl font-bold text-gray-500 text-center">Verifying...</h1>
                    ) : isVerified ? (
                        <div className="text-center flex flex-col items-center justify-center">
                            <Image src={passImg} alt="pass" height={100} width={100} />
                            <h1 className="text-2xl font-bold my-5 text-green-500">
                                Email Verification Success!
                            </h1>
                            <Button asChild>
                                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center flex flex-col items-center justify-center">
                            <Image src={failedImg} alt="fail" height={100} width={200} />
                            <h1 className="text-2xl font-bold my-5 text-red-500">
                                Email Verification Failed!
                            </h1>
                            <Button asChild>
                                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default EmailVerification