import Image from 'next/image'
import React from 'react'
import userIcon from '@/public/assets/user.png'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IoStar } from 'react-icons/io5'

dayjs.extend(relativeTime)

const ReviewList = ({ review }) => {
    return (
        <div className="flex items-start gap-5 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300">
            {/* Avatar */}
            <div className="flex-shrink-0">
                <Image
                    src={review?.avatar?.url || userIcon.src}
                    width={60}
                    height={60}
                    alt="user icon"
                    className="rounded-full object-cover ring-2 ring-gray-200 shadow-sm"
                />
            </div>

            {/* Review Content */}
            <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{review.title}</h4>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                        {[...Array(review.rating)].map((_, i) => (
                            <IoStar key={i} />
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap items-center text-sm text-gray-500 gap-2 mb-3">
                    <span className="font-medium text-gray-700">{review?.reviewedBy}</span>
                    <span className="text-gray-300">•</span>
                    <span>{dayjs(review?.createdAt).fromNow()}</span>
                </div>

                <div className="text-gray-600 leading-relaxed">
                    {review?.review}
                </div>
            </div>
        </div>
    )
}

export default ReviewList
