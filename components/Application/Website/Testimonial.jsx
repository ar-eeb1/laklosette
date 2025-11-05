'use client'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { FaRegStar } from 'react-icons/fa';
import { IoStar } from 'react-icons/io5';
import { BsQuote } from 'react-icons/bs';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Sarah Johnson",
        review: `I have been using this service for a few months now and I am honestly blown away. The quality is consistently high and the support team is always there when I need them. Highly recommended for anyone looking for reliability and great value!`,
        rating: 5
    },
    {
        name: "David Kim",
        review: `At first, I was skeptical, but after trying it out, I was pleasantly surprised. The user interface is intuitive and easy to navigate. Customer service went above and beyond to ensure my satisfaction.`,
        rating: 4
    },
    {
        name: "Emily Carter",
        review: `This product has made my daily workflow so much smoother. I used to spend hours managing tasks manually, but now it is all automated. The attention to detail in the design is just amazing!`,
        rating: 5
    },
    {
        name: "Michael Rodriguez",
        review: `I have tried several alternatives, but none come close to this one. The performance is fast, and I have never encountered any serious bugs. Definitely worth the investment.`,
        rating: 5
    },
    {
        name: "Priya Singh",
        review: `Fantastic experience from start to finish. I especially love how responsive the team is to feedback. Every update brings meaningful improvements.`,
        rating: 4
    },
    {
        name: "James Anderson",
        review: `The best thing about this product is its simplicity. Even someone without technical knowledge can use it easily. It has saved me so much time and effort.`,
        rating: 5
    },
    {
        name: "Laura Chen",
        review: `I appreciate how transparent and honest the company is. There is a real sense of care for their customers. The quality of the product speaks for itself.`,
        rating: 4
    },
    {
        name: "Omar Hassan",
        review: `Honestly, I was not expecting much, but I was proven wrong. The setup process was smooth, and the documentation was clear. Now I can not imagine going back to my old tools.`,
        rating: 5
    },
    {
        name: "Grace Lee",
        review: `I love the way this product keeps evolving. The developers listen to the community and actually implement suggestions. It feels great to be part of something growing.`,
        rating: 4
    },
    {
        name: "Robert Davis",
        review: `It is rare to find a product that delivers exactly what it promises. The pricing is fair, the features are robust, and it just works. Highly dependable and easy to recommend.`,
        rating: 5
    }
];

const Testimonial = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    dots: false,
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    dots: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
        ]
    }

    return (
        <div className="w-full py-6 px-4">
            <h2 className='sm:text-4xl font-semibold text-2xl text-center'>Customer Review</h2>
            <div className="max-w-7xl mx-auto">
                <Slider {...settings}>
                    {testimonials.map((item, index) =>
                        <div key={index} className="px-3 py-4">
                            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6  flex flex-col">
                                <div className="flex-1 mb-4">
                                    <Quote size={35} className='rotate-180 fill-orange-400 outline-none' />
                                    <p className="text-gray-700 text-sm leading-relaxed">{item.review}</p>
                                </div>
                                <div className="border-t pt-4 flex items-center justify-between">
                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                    <div className="flex gap-1">
                                        {Array.from({ length: item.rating }).map((_, i) => (
                                            <IoStar key={`star${i}`} className='text-yellow-500' />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Slider>
            </div>
        </div>
    )
}

export default Testimonial