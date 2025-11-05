'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import EditAction from "@/components/Application/Admin/EditAction"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {  DT_PRODUCT_COLUMN } from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_EDIT, ADMIN_PRODUCT_SHOW, ADMIN_TRASH } from "@/routes/AdminPanelRoute"
import { FilePlus } from "lucide-react"
import Link from "next/link"
import { useCallback, useMemo } from "react"

const BreadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_SHOW, label: 'Product' },
]
const ShowProduct = () => {

  const columns = useMemo(() => {
    return columnConfig(DT_PRODUCT_COLUMN)
  }, [])

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = []
    actionMenu.push(<EditAction href={ADMIN_PRODUCT_EDIT(row.original._id)} key='edit' />)
    actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />)
    return actionMenu

  }, [])

  return (
    <div>
      <BreadCrumb BreadcrumbData={BreadcrumbData} />
      <Card className='shadow-sm p-0 gap-1'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <div className="flex items-center justify-between">
            <h4 className='text-xl font-semibold'>Show Product</h4>
            <Button >
              <FilePlus />
              <Link href={ADMIN_PRODUCT_ADD}>New Product</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className=''>
          <DatatableWrapper
            queryKey='product-data'
            fetchUrl='/api/product'
            initialPageSize={10}
            columnsConfig={columns}
            exportEndPoint='/api/product/export'
            deleteEndPoint='/api/product/delete'
            deleteType='SD'
            trashView={`${ADMIN_TRASH}?trashof=product`}
            createAction={action}
          />

        </CardContent>
      </Card>
    </div >
  )
}

export default ShowProduct
