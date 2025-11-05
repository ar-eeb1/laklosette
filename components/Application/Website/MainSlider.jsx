'use client'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import slider1 from '@/public/assets/images/slider-1.png'
import slider2 from '@/public/assets/images/slider-2.png'
import slider3 from '@/public/assets/images/slider-3.png'
import slider4 from '@/public/assets/images/slider-4.png'
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


const ArrowNext = (props) => {
    const { onClick } = props
    return (
        <button onClick={onClick} type='button' className='flex w-14 h-14 justify-center items-center absolute z-10 top-1/2 -translate-y-1/2 right-10 bg-white/40 rounded-full cursor-pointer'>
            <FaChevronRight />
        </button>
    )
}
const ArrowPrev = (props) => {
    const { onClick } = props
    return (
        <button onClick={onClick} type='button' className='flex w-14 h-14 justify-center items-center absolute z-10 top-1/2 -translate-y-1/2 left-10 bg-white/40 rounded-full cursor-pointer'>
            <FaChevronLeft />
        </button>
    )
}

const MainSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        nextArrow: <ArrowNext />,
        prevArrow: <ArrowPrev />,

        responsive: [
            {
                breakpoint: 480,
                settings: {
                    dots: false,
                    arrows: false,
                    nextArrow: '',
                    prevArrow: '',
                }
            }

        ]
    }
    return (
        <div>
            <Slider {...settings}>
                <div>
                    <Image src={slider1.src} width={slider1.width} height={slider1.height} alt='slider1'></Image>
                </div>
                <div>
                    <Image src={slider2.src} width={slider2.width} height={slider2.height} alt='slider2'></Image>
                </div>
                <div>
                    <Image src={slider3.src} width={slider3.width} height={slider3.height} alt='slider3'></Image>
                </div>
                <div>
                    <Image src={slider4.src} width={slider4.width} height={slider4.height} alt='slider4'></Image>
                </div>
            </Slider>
        </div>
    )
}

export default MainSlider
