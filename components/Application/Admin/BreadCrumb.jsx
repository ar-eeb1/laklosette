import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


function BreadCrumb({ BreadcrumbData }) {
    return (
        <Breadcrumb className='mb-8 mt-16'>
            <BreadcrumbList>
                {BreadcrumbData.length > 0 && BreadcrumbData.map((data, index) => {
                    return (
                        index !== BreadcrumbData.length - 1
                            ?
                            <div key={index} className='flex items-center'>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={data.href}>{data.label}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className='ms-2'/>
                            </div>
                            :
                            <div key={index} className='flex items-center'>
                                 <BreadcrumbItem>
                                    <BreadcrumbLink className='font-bold' href={data.href}>{data.label}</BreadcrumbLink>
                                </BreadcrumbItem>
                            </div>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadCrumb
