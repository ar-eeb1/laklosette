import { IconButton, Tooltip } from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { MaterialReactTable, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton, useMaterialReactTable } from 'material-react-table'
import React, { useState } from 'react'
import RecyclingIcon from '@mui/icons-material/Recycling'
import { Delete, DeleteForever, Restore, SaveAlt } from '@mui/icons-material'
import useDeleteMutation from '@/hooks/useDeleteMutation'
import ButtonLoading from '../ButtonLoading'
import { showToast } from '@/lib/showToast'
import { download, generateCsv, mkConfig } from 'export-to-csv'
import Link from 'next/link'

const DataTable = ({
    queryKey,
    fetchUrl,
    columnsConfig,
    initialPageSize = 10,
    exportEndPoint,
    deleteEndPoint,
    deleteType,
    trashView,
    createAction
}) => {

    // filter,sorting,paginationn states
    const [columnFilters, setColumnFilters] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: initialPageSize
    })
    // row select state
    const [rowSelection, setRowSelection] = useState({})
    //export loading state 
    const [exportLoading, setExportLoading] = useState(false)

    // Handle delete method
    const deleteMutation = useDeleteMutation(queryKey, deleteEndPoint)
    const handleDelete = (ids, deleteType) => {
        let c
        if (deleteType === 'PD') {
            c = confirm('By clicking confirm Data will be deleted Permanently?')
        } else {
            c = confirm('By clicking confirm Data will be moved in trash?')
        }
        if (c) {
            deleteMutation.mutate({ ids, deleteType })
            setRowSelection({})
        }

    }
    // export method
    const handleExport = async (selectedRows) => {
        setExportLoading(true)
        try {
            const csvConfig = mkConfig({
                fieldSeparator: ',',
                decimalSeparator: '.',
                useKeysAsHeaders: true,
                filename: 'CSV_data'
            })

            let csv
            if (Object.keys(rowSelection).length > 0) {
                // export only selected rows
                const rowData = selectedRows.map((row) => row.original)
                csv = generateCsv(csvConfig)(rowData)
            } else {
                // export all data
                const { data: response } = await axios.get(exportEndPoint)
                if (!response.success) {
                    throw new Error(response.message)
                }
                const rowData = response.data
                csv = generateCsv(csvConfig)(rowData)
            }
            download(csvConfig)(csv)
        } catch (error) {
            showToast('error', error.message)

        } finally {
            setExportLoading(false)
        }
    }

    // data fetching logics
    const {
        data: { data = [], meta } = {},
        isError,
        isRefetching,
        isLoading
    } = useQuery({
        queryKey: [queryKey, { columnFilters, globalFilter, pagination, sorting }],
        queryFn: async () => {
            const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL)
            url.searchParams.set('start', `${pagination.pageIndex * pagination.pageSize}`)
            url.searchParams.set('size', `${pagination.pageSize}`)
            url.searchParams.set('filters', JSON.stringify(columnFilters ?? []))
            url.searchParams.set('globalFilter', globalFilter ?? '')
            url.searchParams.set('sorting', JSON.stringify(sorting ?? []))
            url.searchParams.set('deleteType', deleteType)

            const { data: response } = await axios.get(url.href)
            return response
        },
        placeholderData: keepPreviousData,
    })

    // init table
    const table = useMaterialReactTable({
        columns: columnsConfig,
        data,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        enableColumnOrdering: true,
        enableStickyHeader: true,
        enableTableFooter: true,
        initialState: { showColumnFilters: true },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: 'Error loading data'
            }
            : undefined,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        rowCount: meta?.totalRowCount ?? 0,
        onRowSelectionChange: setRowSelection,
        state: {
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
            rowSelection
        },
        getRowId: (originalRow) => originalRow._id,


        renderToolbarInternalActions: ({ table }) => (
            <>
                {/* bultin buttons */}
                < MRT_ToggleGlobalFilterButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_ToggleFullScreenButton table={table} />
                <MRT_ToggleDensePaddingButton table={table} />

                {deleteType !== 'PD'
                    &&
                    <Tooltip title='Recycle bin'>
                        <Link href={trashView}>
                            <IconButton>
                                <RecyclingIcon />
                            </IconButton>
                        </Link>
                    </Tooltip>
                }

                {
                    deleteType === 'SD'
                    &&
                    <Tooltip title='Delete All'>
                        <IconButton disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                }

                {
                    deleteType === 'PD'
                    &&
                    <>
                        <Tooltip title='Restore data'>
                            <IconButton disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => handleDelete(Object.keys(rowSelection), 'RSD')}>
                                <Restore />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Permanently Delete'>
                            <IconButton disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}>
                                <DeleteForever />
                            </IconButton>
                        </Tooltip>
                    </>
                }
            </>
        ),
        enableRowActions: true,
        positionActionsColumn: 'last',
        renderRowActionMenuItems: ({ row }) => createAction(row, deleteType, handleDelete),
        renderTopToolbarCustomActions: ({ table }) => (
            <Tooltip>
                <ButtonLoading
                    type='button'
                    text={<><SaveAlt /> Export </>}
                    loading={exportLoading}
                    onClick={() => handleExport(table.getSelectedRowModel().rows)}
                    className='cursor-pointer'
                />
            </Tooltip>
        )
    })

    return (
        <MaterialReactTable id={Date.now} table={table} />
    )
}

export default DataTable
