import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const LatestOrder = () => {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow >
                        <TableHead>Order Id</TableHead>
                        <TableHead>Payment Id</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">{`INV00${i}`}</TableCell>
                            <TableCell >{`Pay${Math.floor((Math.random()+1)*1000)}`}</TableCell>
                            {/* <TableCell>Paid</TableCell> */}
                            <TableCell>{Math.floor((Math.random()+1)*10)}</TableCell>
                            <TableCell>Pending</TableCell>
                            <TableCell className="font-bold">$250.00</TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </div>
    )
}

export default LatestOrder
