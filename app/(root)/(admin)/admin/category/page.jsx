'use client'
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import EditAction from "@/components/Application/Admin/EditAction"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DT_CATEGORY_COLUMN } from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_EDIT, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute"
import { FilePlus } from "lucide-react"
import Link from "next/link"
import { useCallback, useMemo } from "react"

const BreadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_CATEGORY_SHOW, label: 'Category' },
]
const ShowCategory = () => {

  const columns = useMemo(() => {
    return columnConfig(DT_CATEGORY_COLUMN)
  }, [])

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = []
    actionMenu.push(<EditAction href={ADMIN_CATEGORY_EDIT(row.original._id)} key='edit' />)
    actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} />)
    return actionMenu

  }, [])

  return (
    <div>
      <BreadCrumb BreadcrumbData={BreadcrumbData} />
      <Card className='shadow-sm p-0 gap-1'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <div className="flex items-center justify-between">
            <h4 className='text-xl font-semibold'>Show Category</h4>
            <Button >
              <FilePlus />
              <Link href={ADMIN_CATEGORY_ADD}>New Category</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className=''>
          <DatatableWrapper
            queryKey='category-data'
            fetchUrl='/api/category'
            initialPageSize={10}
            columnsConfig={columns}
            exportEndPoint='/api/category/export'
            deleteEndPoint='/api/category/delete'
            deleteType='SD'
            trashView={`${ADMIN_TRASH}?trashof=category`}
            createAction={action}
          />

        </CardContent>
      </Card>
    </div >
  )
}

export default ShowCategory
