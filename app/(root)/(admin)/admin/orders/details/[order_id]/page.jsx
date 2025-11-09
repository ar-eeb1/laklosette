'use client'
import ImgPlaceholder from '@/public/products/41o7qz+iJfL.jpg'
import Image from "next/image"
import Link from "next/link"
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute"
import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import { ADMIN_DASHBOARD, ADMIN_ORDER_SHOW } from "@/routes/AdminPanelRoute"
import { use, useEffect, useState } from "react"
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Application/Select'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const BreadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_ORDER_SHOW, label: 'Orders' },
  { href: '', label: 'Order Details' },
]

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Unverified', value: 'unverified' },
]


const OrderDetails = ({ params }) => {
  const router = useRouter()
  const { order_id } = use(params)
  const { data, loading } = useFetch(`/api/orders/get/${order_id}`)
  const [orderData, setOrderData] = useState()
  const [orderStatus, setOrderStatus] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const totalQty = orderData?.products?.reduce((sum, product) => sum + product.qty, 0) || 0
  const totalPrice = orderData?.products?.reduce((sum, product) => sum + (product.qty * product.sellingPrice), 0) || 0

  useEffect(() => {
    if (data && data.success) {
      setOrderData(data.data)
      setOrderStatus(data?.data?.status)
    }
  }, [data])

  const handleOrderStatus = async () => {
    setUpdatingStatus(true)
    try {
      const { data: response } = await axios.put('/api/orders/update-status', {
        _id: orderData?._id,
        status: orderStatus
      })
      if (!response.success) {
        throw new Error(response.message)
      }
      showToast('success', response.message)
      router.refresh()
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <div>
      <BreadCrumb BreadcrumbData={BreadcrumbData} />

      <div className="">
        {!orderData ?
          <div className="flex justify-center items-center py-32">
            <div className="bg-white rounded-2xl shadow-xl p-12 border-l-4 border-red-500">
              <h4 className="text-red-500 text-2xl font-bold">Order Not Found</h4>
              <p className="text-gray-600 mt-2">The order you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
          :
          <div className="space-y-8">/
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b-2 border-blue-500">
                Order Information
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded-xl p-5 border border-yellow-200 dark:border-yellow-800 transition-colors duration-300">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Order ID</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {orderData?.order_id}
                  </p>
                </div>

                <div className="bg-orange-100 dark:bg-orange-900/40 rounded-xl p-5 border border-orange-200 dark:border-orange-800 transition-colors duration-300">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Delivery Method</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    Cash on delivery
                  </p>
                </div>

                <div className="bg-green-100 dark:bg-green-900/40 rounded-xl p-5 border border-green-200 dark:border-green-800 transition-colors duration-300">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Status</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100 capitalize">
                    {orderStatus}
                  </p>
                </div>
              </div>
            </div>


            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black px-8 py-6">
                <h2 className="text-2xl font-bold text-white">Order Items</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-600 md:table-header-group hidden">
                    <tr>
                      <th className="text-start p-5 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="text-center p-5 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="text-center p-5 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="text-center p-5 text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {orderData?.products?.map((product) => (
                      <tr
                        key={product.variantId._id}
                        className=" hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <td className="p-5">
                          <div className="flex items-center md:flex-row flex-col gap-6">
                            <Image
                              src={
                                product?.variantId?.media[0]?.secure_url ||
                                ImgPlaceholder.src
                              }
                              width={80}
                              height={80}
                              alt="product"
                              className="rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-600 object-cover"
                            />
                          </div>
                          <div className="flex">
                            <div className="flex-grow">
                              <h4 className="text-lg font-semibold mb-2">
                                <Link
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 transition-colors"
                                  href={WEBSITE_PRODUCT_DETAILS(
                                    product?.productId?.slug
                                  )}
                                >
                                  {product?.productId?.name}
                                </Link>
                              </h4>
                              <div>

                                <div className="flex flex-wrap gap-3 mt-2">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                    COLOR: {product?.variantId?.color}
                                  </span>
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                                    SIZE: {product?.variantId?.size}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="md:table-cell flex justify-between md:p-5 px-5 py-3 text-center">
                          <span className="md:hidden font-semibold text-gray-700 dark:text-gray-300">
                            Price
                          </span>
                          <span className="font-bold text-gray-900 dark:text-gray-100">
                            {product.sellingPrice.toLocaleString("en-PK", {
                              style: "currency",
                              currency: "PKR",
                            })}
                          </span>
                        </td>

                        <td className="md:table-cell flex justify-between md:p-5 px-5 py-3 text-center">
                          <span className="md:hidden font-semibold text-gray-700 dark:text-gray-300">
                            Quantity
                          </span>
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600 font-bold text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-500">
                            {product.qty}
                          </span>
                        </td>

                        <td className="md:table-cell flex justify-between md:p-5 px-5 py-3 text-center">
                          <span className="md:hidden font-semibold text-gray-700 dark:text-gray-300">
                            Total Price
                          </span>
                          <span className="font-bold text-lg text-green-600 dark:text-green-400">
                            {(product.qty * product.sellingPrice).toLocaleString("en-PK", {
                              style: "currency",
                              currency: "PKR",
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-t-2 border-gray-300 dark:border-gray-600">
                    <tr>
                      <td
                        className="p-5 text-right font-bold text-gray-800 dark:text-gray-200 text-lg"
                        colSpan="2"
                      >
                        Total
                      </td>
                      <td className="p-5 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 font-bold text-white text-lg border-2 border-blue-700 dark:border-blue-400 shadow-md">
                          {totalQty}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="font-bold text-xl text-green-700 dark:text-green-400">
                          {totalPrice.toLocaleString("en-PK", {
                            style: "currency",
                            currency: "PKR",
                          })}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>


            {/* shipping address */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-500">
                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Shipping Address </h4>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-6 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                <table className="w-full border-collapse">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="font-semibold py-4 text-gray-700 dark:text-gray-200 w-1/3">
                        Name
                      </td>
                      <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">
                        {orderData?.name}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="font-semibold py-4 text-gray-700 dark:text-gray-200 w-1/3">
                        Email
                      </td>
                      <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">
                        {orderData?.email}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="font-semibold py-4 text-gray-700 dark:text-gray-200 w-1/3">
                        Phone
                      </td>
                      <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">
                        {orderData?.phone}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="font-semibold py-4 text-gray-700 dark:text-gray-200 w-1/3">
                        Country
                      </td>
                      <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">
                        {orderData?.country}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="font-semibold py-4 text-gray-700 dark:text-gray-200 w-1/3">
                        State
                      </td>
                      <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">
                        {orderData?.state}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="font-semibold py-4 text-gray-700 dark:text-gray-200 w-1/3">
                        City
                      </td>
                      <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">
                        {orderData?.city}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="font-semibold py-4 text-gray-700 dark:text-gray-200 w-1/3">
                        Pincode
                      </td>
                      <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">
                        {orderData?.pincode}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="font-semibold py-4 text-gray-700 dark:text-gray-200 w-1/3">
                        Address
                      </td>
                      <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">
                        {orderData?.landmark}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="font-semibold py-4 text-gray-700 dark:text-gray-200 w-1/3">
                        Order Note
                      </td>
                      <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">
                        {orderData?.ordernote}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>


            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-500">
                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Billing Details
                </h4>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-6 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="font-bold py-4 text-gray-700 dark:text-gray-200 w-full">Subtotal</td>
                      <td className="py-4 text-gray-900 dark:text-gray-100 font-medium"> {orderData?.subtotal.toLocaleString('en-PK', { style: 'currency', currency: 'PKR', })} </td>
                    </tr>

                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="font-bold py-4 text-gray-700 dark:text-gray-200 w-full">Discount</td>
                      <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">{orderData?.discount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR', })}
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="font-bold py-4 text-gray-700 dark:text-gray-200 w-full">Coupon Discount</td>
                      <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">  {orderData?.couponDiscountAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR', })}</td>
                    </tr>

                    <tr>
                      <td className="font-bold py-4 text-gray-700 dark:text-gray-200 w-full">Total</td>
                      <td className="py-4 text-gray-900 dark:text-gray-100 font-medium">  {orderData?.totalAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR', })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="pt-3 flex flex-col gap-3">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  Order Status
                </h4>

                <div className="flex flex-col sm:flex-row w-full gap-3">

                  <div className="w-full sm:w-2/3">
                    <Select
                      options={statusOptions}
                      selected={orderStatus}
                      setSelected={(value) => setOrderStatus(value)}
                      placeholder="Select"
                      isMulti={false}
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                    />
                  </div>

                  <div className="w-full sm:w-1/3">
                    <ButtonLoading loading={updatingStatus} type="button" onClick={handleOrderStatus} text="Save Status" className="w-full text-white font-semibold py-2 rounded-lg shadow-md transition-colors duration-200" />
                  </div>
                </div>
              </div>



            </div>


          </div>
        }
      </div>
    </div>
  )
}

export default OrderDetails