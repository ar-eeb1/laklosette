import React from 'react'
import CountOverview from './CountOverview'
import QuickAdd from './QuickAdd'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { OrderOverview } from './OrderOverview'
import { OrderStatus } from './OrderStatus'
import LatestOrder from './LatestOrder'
import LatestReview from './LatestReview'
import { StarIcon } from 'lucide-react'
import { ADMIN_ORDER_SHOW, ADMIN_REVIEW_SHOW } from '@/routes/AdminPanelRoute'

const AdminDashboard = () => {
  return (
    <div className='mt-20'>
      <CountOverview />
      <QuickAdd />

      <div className='mt-10 md:flex-nowrap gap-2 md:flex  '>
        <Card className='rounded-lg lg:w-[70%] w-full p-0 '>
          <CardHeader className='py-3 border-b [.border-b]:pb-3'>
            <div className='flex justify-between items-center '>
              <div>
                <span className='font-semibold'>Order Overview</span>
              </div>
              <div>
                <Button type='button'>
                  <Link href={ADMIN_ORDER_SHOW}>View All</Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <OrderOverview />
          </CardContent>
        </Card>

        <Card className='rounded-lg lg:w-[30%] w-full p-0 mt-5 md:mt-0'>
          <CardHeader className='py-3 border-b [.border-b]:pb-6 '>
            <div className='flex justify-between'>
              <span className='font-semibold'>Orders Status</span>
              <Button type='button'>
                <Link href={ADMIN_ORDER_SHOW}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <OrderStatus />
          </CardContent>
        </Card>
      </div>

      <div className='md:mt-10 mt-5 md:flex lg:flex-nowrap gap-2 '>

        <Card className='rounded-lg lg:w-[70%] w-full p-0 block '>
          <CardHeader className='py-3 border-b [.border-b]:pb-3'>
            <div className='flex justify-between items-center '>
              <div>
                <span className='font-semibold'>Latest Order</span>
              </div>
              <div>
                <Button type='button'>
                  <Link href={ADMIN_ORDER_SHOW}>View All</Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className='gap-1 h-60 md:h-[350px] overflow-auto'>
            <LatestOrder />
          </CardContent>
        </Card>

        <Card className='rounded-lg lg:w-[30%] w-full p-0 mt-5 md:mt-0'>
          <CardHeader className='py-3 border-b [.border-b]:pb-6 '>
            <div className='flex justify-between'>
              <span className='font-semibold'>Latest Review</span>
              <Button type='button'>
                <Link href={ADMIN_REVIEW_SHOW}>View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className='gap-1 h-60 lg:h-[350px] overflow-auto p-0'>
            <LatestReview />
          </CardContent>
        </Card>

      </div>


    </div>
  )
}

export default AdminDashboard
