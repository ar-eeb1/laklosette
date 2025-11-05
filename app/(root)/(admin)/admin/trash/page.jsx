'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DT_CATEGORY_COLUMN, DT_COUPON_COLUMN, DT_CUSTOMERS_COLUMN, DT_PRODUCT_COLUMN, DT_PRODUCT_VARIAMT_COLUMN, DT_PRODUCT_VARIANT_COLUMN, DT_REVIEW_COLUMN } from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute"
import { useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"

const BreadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: ADMIN_TRASH, label: 'Trash' },
]

const TRASH_CONFIG = {
    category: {
        title: 'Category Trash',
        columns: DT_CATEGORY_COLUMN,
        fetchUrl: '/api/category',
        exporturl: '/api/category/export',
        deleteurl: '/api/category/delete',
    },
    product: {
        title: 'Product Trash',
        columns: DT_PRODUCT_COLUMN,
        fetchUrl: '/api/product',
        exporturl: '/api/product/export',
        deleteurl: '/api/product/delete',
    },
    "product-variant": {
        title: 'Product Variant Trash',
        columns: DT_PRODUCT_VARIANT_COLUMN,
        fetchUrl: '/api/product-variant',
        exporturl: '/api/product-variant/export',
        deleteurl: '/api/product-variant/delete',
    },
    coupon: {
        title: 'Coupon Trash',
        columns: DT_COUPON_COLUMN,
        fetchUrl: '/api/coupon',
        exporturl: '/api/coupon/export',
        deleteurl: '/api/coupon/delete',
    },
    customers: {
        title: 'Customer Trash',
        columns: DT_CUSTOMERS_COLUMN,
        fetchUrl: '/api/customers',
        exporturl: '/api/customers/export',
        deleteurl: '/api/customers/delete',
    },
    review: {
        title: 'Review Trash',
        columns: DT_REVIEW_COLUMN,
        fetchUrl: '/api/review',
        exporturl: '/api/review/export',
        deleteurl: '/api/review/delete',
    },

}
const Trash = () => {

    const searchParams = useSearchParams()
    const trashOf = searchParams.get('trashof')
    const config = TRASH_CONFIG[trashOf]

    const columns = useMemo(() => {
        return columnConfig(config.columns, false, false, true)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        return [<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />]
    }, [])

    return (
        <div>
            <BreadCrumb BreadcrumbData={BreadcrumbData} />
            <Card className='shadow-sm p-0 gap-1'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className="flex items-center justify-between">
                        <h4 className='text-xl font-semibold'>{config.title}</h4>
                    </div>
                </CardHeader>
                <CardContent className=''>
                    <DatatableWrapper
                        queryKey={`${trashOf}-data-deleted`}
                        fetchUrl={config.fetchUrl}
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndPoint={config.exporturl}
                        deleteEndPoint={config.deleteurl}
                        deleteType='PD'
                        createAction={action}
                    />

                </CardContent>
            </Card>
        </div >
    )
}

export default Trash
