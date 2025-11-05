import MainSlider from '@/components/Application/Website/MainSlider'
import Link from 'next/link'
import React from 'react'
import banner1 from '@/public/assets/images/banner1.png'
import banner2 from '@/public/assets/images/banner2.png'
import Image from 'next/image'
import FeaturedProducts from '@/components/Application/Website/FeaturedProducts'
import advertising from '@/public/assets/images/advertising-banner.png'
import Testimonial from '@/components/Application/Website/Testimonial'

const Home = () => {
  return (
    <>
      <section>
        <MainSlider />
      </section>
      <section className='lg:px-32 px-4 sm:pt-20 pt-5 pb-10'>

        <div className='grid grid-cols-2 sm:gap-10 gap-2'>

          <div className='border rounded-lg overflow-hidden'>
            <Link href=''>
              <Image
                src={banner1.src}
                width={banner1.width}
                height={banner1.height}
                alt='banner1'
                className='hover:scale-105 transition-all duration-150'
              />
            </Link>
          </div>
          <div className='border rounded-lg overflow-hidden'>
            <Link href=''>
              <Image
                src={banner2.src}
                width={banner2.width}
                height={banner2.height}
                alt='banner2'
                className='hover:scale-105 transition-all duration-150'
              />
            </Link>

          </div>
        </div>
      </section>

      <FeaturedProducts />

      <section className='sm:pt-20 pt-5 pb-10'>
        <Image
          src={advertising.src}
          width={advertising.width}
          height={advertising.height}
          alt={advertising.alt || 'ad'} 
          title={advertising.title}
          className='w-full'
        />
      </section>

      <section className='lg:px-32 px-4 sm:pt-20 pt-5 pb-10'>
        <Testimonial />
      </section >

      <section className=' py-5 border-t grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 '>
        <div className='flex justify-center flex-col items-center shadow m-4 p-5 rounded-2xl'>
          <lord-icon
            src="https://cdn.lordicon.com/jzzzcrxv.json"
            trigger="loop"
            delay="1000"
            colors="primary:#e88c30,secondary:#e88c30"
            style={{ width: 50, height: 50 }}
          >
          </lord-icon>

          <h1 className='font-bold text-2xl'>7 Days Return</h1>
          <p>Risk-Free shopping with easy returns</p>
        </div>

        <div className='flex justify-center flex-col items-center shadow m-4 p-5 rounded-2xl'>
          <lord-icon
            src="https://cdn.lordicon.com/byupthur.json"
            trigger="loop"
            delay="1000"
            colors="primary:#e88c30,secondary:#e88c30"
            style={{ width: 50, height: 50 }}
          >
          </lord-icon>
          <h1 className='font-bold text-2xl'>Free Shipping</h1>
          <p>No extra cost, Just the price you see</p>
        </div>

        <div className='flex justify-center flex-col items-center shadow m-4 p-5 rounded-2xl'>
          <lord-icon
            src="https://cdn.lordicon.com/jdgfsfzr.json"
            trigger="loop"
            delay="1000"
            colors="primary:#e88c30,secondary:#e88c30"
            style={{ width: 50, height: 50 }}
          >
          </lord-icon>
          <h1 className='font-bold text-2xl'>24/7 support</h1>
          <p>24/7 support, always here just for you</p>
        </div>

        <div className='flex justify-center flex-col items-center shadow m-4 p-5 rounded-2xl'>
          <lord-icon
            src="https://cdn.lordicon.com/dkobpcrm.json"
            trigger="loop"
            delay="1000"
            colors="primary:#e88c30,secondary:#e88c30"
            style={{ width: 50, height: 50 }}
          >
          </lord-icon>
          <h1 className='font-bold text-2xl'>Members discount</h1>
          <p>Special offers for our loyal customers</p>
        </div>

      </section >
    </>
  )
}

export default Home
