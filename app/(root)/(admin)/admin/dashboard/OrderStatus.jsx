"use client"

import { Label, Pie, PieChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import React from "react"

export const description = "A donut chart"

const chartData = [
    { status: "pending", count: 275, fill: "var(--color-pending)" },
    { status: "processing", count: 200, fill: "var(--color-processing)" },
    { status: "shipped", count: 187, fill: "var(--color-shipped)" },
    { status: "delivered", count: 173, fill: "var(--color-delivered)" },
    { status: "cancelled", count: 90, fill: "var(--color-cancelled)" },
    { status: "unverified", count: 90, fill: "var(--color-unverified)" },
]

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
                                                127
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
                        <span className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-[#F54A00] text-white">0</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Processing</span>
                        <span className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-[#009689] text-white">0</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Shipped</span>
                        <span className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-[#104e64] text-white">0</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Delivered</span>
                        <span className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-[#FFB900] text-white">0</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Cancelled</span>
                        <span className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-[#FE9A00] text-white">0</span>
                    </li>
                    <li className="flex justify-between items-center mb-3 text-sm">
                        <span>Unverified</span>
                        <span className="rounded-full w-6 h-6 flex items-center justify-center text-sm bg-black text-white">0</span>
                    </li>
                </ul>
            </div>
        </div>

    )
}
