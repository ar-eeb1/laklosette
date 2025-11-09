"use client"

import { Label, Pie, PieChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import React, { useEffect, useState } from "react"
import useFetch from "@/hooks/useFetch"

export const description = "A donut chart"

const chartConfig = {
    status: {
        label: "Status",
    },
    pending: {
        label: "Pending",
        color: "var(--chart-1)",
    },
    processing: {
        label: "Processing",
        color: "var(--chart-2)",
    },
    shipped: {
        label: "Shipped",
        color: "var(--chart-3)",
    },
    delivered: {
        label: "Delivered",
        color: "var(--chart-4)",
    },
    cancelled: {
        label: "Cancelled",
        color: "var(--chart-5)",
    },
    unverified: {
        label: "Unverified",
        color: "var(--chart-6)",
    },
}


export function OrderStatus() {
    const [chartData, setChartData] = useState([])
    const [statusCount, setStatusCount] = useState()
    const [totalCount, setTotalCount] = useState(0)
    const { data: orderStatus, loading } = useFetch('/api/dashboard/admin/order-status')

    useEffect(() => {
        if (orderStatus && orderStatus.success) {
            const newOrderStatus = orderStatus.data.map((o) => ({
                status: o._id,
                count: o.count,
                fill: `var(--color-${o._id})`
            }))
            setChartData(newOrderStatus)
            const getTotalCount = orderStatus.data.reduce((acc, curr) => acc + curr.count, 0)
            setTotalCount(getTotalCount)

            const statusObj = orderStatus.data.reduce((acc, item) => {
                acc[item._id] = item.count
                return acc;
            },{})

            setStatusCount(statusObj)
        }
    }, [orderStatus])
    


    return (
        <div>
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    />
                    <Pie
                        data={chartData}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={60}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                {totalCount}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                Order status
                                            </tspan>
                                        </text>
                                    )
                                }
                            }}
                        />
                    </Pie>

                </PieChart>
            </ChartContainer>
            <div>
                <ul>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Pending</span>
                        <span className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-[#F54A00] text-white">{statusCount?.pending || 0}</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Processing</span>
                        <span className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-[#009689] text-white">{statusCount?.processing || 0}</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Shipped</span>
                        <span className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-[#104e64] text-white">{statusCount?.shipped || 0}</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Delivered</span>
                        <span className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-[#FFB900] text-white">{statusCount?.delivered || 0}</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Cancelled</span>
                        <span className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-[#FE9A00] text-white">{statusCount?.cancelled || 0}</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Unverified</span>
                        <span className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-black text-white">{statusCount?.unverified || 0}</span>
                    </li>
                </ul>
            </div>
        </div>

    )
}
