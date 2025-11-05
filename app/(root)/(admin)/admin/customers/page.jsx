'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {   DT_CUSTOMERS_COLUMN} from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute"

import { useCallback, useMemo } from "react"

const BreadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: '', label: 'Customers' },
]
const ShowCustomers = () => {

  const columns = useMemo(() => {
    return columnConfig(DT_CUSTOMERS_COLUMN)
  }, [])

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = []
   actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />)
    return actionMenu

  }, [])

  return (
    <div>
      <BreadCrumb BreadcrumbData={BreadcrumbData} />
      <Card className='shadow-sm p-0 gap-1'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <div className="flex items-center justify-between">
            <h4 className='text-xl font-semibold'>Customers</h4>
           
          </div>
        </CardHeader>
        <CardContent className=''>
          <DatatableWrapper
            queryKey='customers-data'
            fetchUrl='/api/customers'
            initialPageSize={10}
            columnsConfig={columns}
            exportEndPoint='/api/customers/export'
            deleteEndPoint='/api/customers/delete'
            deleteType='SD'
            trashView={`${ADMIN_TRASH}?trashof=customers`}
            createAction={action}
          />

        </CardContent>
      </Card>
    </div >
  )
}

export default ShowCustomers
