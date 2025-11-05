'use client'
import { useEffect, useState } from 'react'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoute'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import Media from '@/components/Application/Admin/Media'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import useDeleteMutation from '@/hooks/useDeleteMutation'
import ButtonLoading from '@/components/Application/ButtonLoading'

const BreadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: '', label: 'Media' },
]

const MediaPage = () => {

    const fetchMedia = async (page, deleteType) => {
        const { data: response } = await axios.get(`/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`)
        return response
    }
    const queryClient = useQueryClient()
    const [deleteType, setDeleteType] = useState('SD')
    const [selectedMedia, setSelectedMedia] = useState([])
    const [selectAll, setSelectAll] = useState(false)

    const searchParams = useSearchParams()
    useEffect(() => {
        if (searchParams) {
            const trashOf = searchParams.get('trashof')
            setSelectedMedia([])
            if (trashOf) {
                setDeleteType('PD')
            } else {
                setDeleteType('SD')
            }
        }
    }, [searchParams])


    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['media-data', deleteType],
        queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            const nextPage = pages.length
            return lastPage.hasMore ? nextPage : undefined
        },
    })

    const deleteMutation = useDeleteMutation('media-data', '/api/media/delete')
    const handleDelete = (ids, deleteType) => {
        let c = true
        if (deleteType === 'PD') {
            c = confirm('By clicking confirm Media will be deleted Permanently?')
        }
        if (c) {
            deleteMutation.mutate({ ids, deleteType })
        }
        setSelectAll(false)
        setSelectedMedia([])
    }

    const handleSelectAll = () => {
        setSelectAll(!selectAll)
    }

    useEffect(() => {
        if (selectAll) {
            const ids = data.pages.flatMap(page => page.mediaData.map(media => media._id))
            setSelectedMedia(ids)
        } else {
            setSelectedMedia([])
        }
    }, [selectAll])


    return (
        <div className=''>
            <BreadCrumb BreadcrumbData={BreadcrumbData} />
            <Card className='py-0 shadow-sm'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex justify-between items-center'>
                        <h4 className='font-semibold text-xl uppercase'>

                            {deleteType === 'SD' ? 'Media' : 'media Trash'}

                        </h4>

                        <div className='flex items-center gap-5'>
                            {deleteType === 'SD' && <UploadMedia isMultiple={true} queryClient={queryClient} />}
                            <div className='flex gap-3'>
                                {deleteType === 'SD' ?
                                    <Button type='button' variant='destructive'>
                                        <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>
                                            Trash
                                        </Link>
                                    </Button >
                                    :
                                    <Button type='button' >
                                        <Link href={`${ADMIN_MEDIA_SHOW}`}>
                                            Back To Media
                                        </Link>
                                    </Button >

                                }
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {selectedMedia.length > 0 &&
                        <div className='py-2 px-3 border-primary mb-2 rounded-lg flex justify-between items-center gap-3'>
                            <Label className='gap-3'>
                                <Checkbox
                                    className='border border-primary cursor-pointer'
                                    checked={selectAll}
                                    onCheckedChange={handleSelectAll}
                                />
                                Select All
                            </Label>
                            <div className='flex gap-2'>
                                {deleteType === 'SD' ?
                                    <Button variant='destructive' onClick={() => handleDelete(selectedMedia, deleteType)}>
                                        Move into Trash
                                    </Button> :
                                    <div className='gap-3'>
                                        <Button className='bg-primary cursor-pointer mr-4' onClick={() => handleDelete(selectedMedia, 'RSD')}>
                                            Restore
                                        </Button>
                                        <Button variant='destructive' className='cursor-pointer' onClick={() => handleDelete(selectedMedia, deleteType)}>
                                            Delete Permanently
                                        </Button>
                                    </div>
                                }
                            </div>
                        </div>
                    }

                    {status === 'pending'
                        ?
                        <div className='text-center flex gap-2 justify-between '>
                            <div className='w-[200px] h-[200px] bg-gray-200 rounded-xl animate-pulse'></div>
                            <div className='w-[200px] h-[200px] bg-gray-200 rounded-xl animate-pulse'></div>
                            <div className='w-[200px] h-[200px] bg-gray-200 rounded-xl animate-pulse'></div>
                            <div className='w-[200px] h-[200px] bg-gray-200 rounded-xl animate-pulse'></div>
                            <div className='w-[200px] h-[200px] bg-gray-200 rounded-xl animate-pulse'></div>
                            <div className='w-[200px] h-[200px] bg-gray-200 rounded-xl animate-pulse'></div>
                            <div className='w-[200px] h-[200px] bg-gray-200 rounded-xl animate-pulse'></div>
                        </div>
                        :
                        status === 'error' ?
                            <div className='text-red-500 text-sm'>
                                {error.message}
                            </div>
                            :
                            <>
                                {data.pages.flatMap(page => page.mediaData.map(media => media._id)).length === 0 && <div className='text-center '>No media Found</div>}
                                <div className='grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5 '>
                                    {
                                        data?.pages?.map((page, index) => (
                                            <React.Fragment key={index}>
                                                {
                                                    page?.mediaData.map((media) => (
                                                        <Media
                                                            key={media._id}
                                                            media={media}
                                                            handleDelete={handleDelete}
                                                            deleteType={deleteType}
                                                            setSelectedMedia={setSelectedMedia}
                                                            selectedMedia={selectedMedia}
                                                        />
                                                    ))
                                                }
                                            </React.Fragment>
                                        ))
                                    }
                                </div>
                            </>
                    }
                    {hasNextPage &&
                        <ButtonLoading onClick={() => fetchNextPage()} text='Load More' />
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default MediaPage
