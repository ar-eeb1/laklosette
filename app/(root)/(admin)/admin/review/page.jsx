'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {  DT_REVIEW_COLUMN} from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import { ADMIN_DASHBOARD, ADMIN_REVIEW_SHOW, ADMIN_TRASH } from "@/routes/AdminPanelRoute"

import { useCallback, useMemo } from "react"

const BreadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_REVIEW_SHOW, label: 'Reviews' },
]
const ShowReview = () => {

  const columns = useMemo(() => {
    return columnConfig(DT_REVIEW_COLUMN)
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
            <h4 className='text-xl font-semibold'>Reviews</h4>
           
          </div>
        </CardHeader>
        <CardContent className=''>
          <DatatableWrapper
            queryKey='review-data'
            fetchUrl='/api/review'
            initialPageSize={10}
            columnsConfig={columns}
            exportEndPoint='/api/review/export'
            deleteEndPoint='/api/review/delete'
            deleteType='SD'
            trashView={`${ADMIN_TRASH}?trashof=review`}
            createAction={action}
          />

        </CardContent>
      </Card>
    </div >
  )
}

export default ShowReview
