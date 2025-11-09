import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb"
import axios from "axios"
import ImgPlaceholder from '@/public/products/41o7qz+iJfL.jpg'
import Image from "next/image"
import Link from "next/link"
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute"


const OrderDetails = async ({ params }) => {
  const { orderid } = await params
  const { data: orderData } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/get/${orderid}`)
  const totalQty = orderData?.data?.products?.reduce((sum, product) => sum + product.qty, 0) || 0
  const totalPrice = orderData?.data?.products?.reduce((sum, product) => sum + (product.qty * product.sellingPrice), 0) || 0

  const breadcrumb = {
    title: 'Order Details',
    links: [{ label: 'Order Details' }]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WebsiteBreadCrumb props={breadcrumb} />

      <div className="lg:px-32 px-5 my-20">
        {orderData && !orderData.success ?
          <div className="flex justify-center items-center py-32">
            <div className="bg-white rounded-2xl shadow-xl p-12 border-l-4 border-red-500">
              <h4 className="text-red-500 text-2xl font-bold">Order Not Found</h4>
              <p className="text-gray-600 mt-2">The order you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
          :
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-blue-500">Order Information</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-yellow-100 rounded-xl p-5 border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="text-lg font-bold text-gray-800">{orderData?.data?.order_id}</p>
                </div>
                <div className="bg-orange-100 rounded-xl p-5 border border-orange-200">
                  <p className="text-sm text-gray-600 mb-1">Delivery Method</p>
                  <p className="text-lg font-bold text-gray-800">Cash on delivery</p>
                </div>
                <div className="bg-red-100 rounded-xl p-5 border border-red-200">
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="text-lg font-bold text-gray-800 capitalize">{orderData?.data?.status}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">Order Items</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-300 md:table-header-group hidden">
                    <tr>
                      <th className="text-start p-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Product</th>
                      <th className="text-center p-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Price</th>
                      <th className="text-center p-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Quantity</th>
                      <th className="text-center p-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orderData && orderData?.data?.products?.map((product, index) => (
                      <tr key={product.variantId._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="p-5">
                          <div className="flex items-center gap-6">
                            <div className="flex-shrink-0">
                              <Image
                                src={product?.variantId?.media[0]?.secure_url || ImgPlaceholder.src}
                                width={80}
                                height={80}
                                alt="product"
                                className="rounded-xl shadow-md border-2 border-gray-200 object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="text-lg font-semibold mb-2">
                                <Link className="text-blue-600 hover:text-blue-800 underline decoration-2 transition-colors" href={WEBSITE_PRODUCT_DETAILS(product?.productId?.slug)}>
                                  {product?.productId?.name}
                                </Link>
                              </h4>
                              <div className="flex flex-wrap gap-3 mt-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                  COLOR: {product?.variantId?.color}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                  SIZE: {product?.variantId?.size}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="md:table-cell flex justify-between md:p-5 px-5 py-3 text-center">
                          <span className="md:hidden font-semibold text-gray-700">Price</span>
                          <span className="font-bold text-gray-900">{product.sellingPrice.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}</span>
                        </td>

                        <td className="md:table-cell flex justify-between md:p-5 px-5 py-3 text-center">
                          <span className="md:hidden font-semibold text-gray-700">Quantity</span>
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 font-bold text-gray-900 border-2 border-gray-300">{product.qty}</span>
                        </td>

                        <td className="md:table-cell flex justify-between md:p-5 px-5 py-3 text-center">
                          <span className="md:hidden font-semibold text-gray-700">Total Price</span>
                          <span className="font-bold text-lg text-green-600">{(product.qty * product.sellingPrice).toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gradient-to-r from-gray-100 to-gray-200 border-t-2 border-gray-300">
                    <tr>
                      <td className="p-5 text-right font-bold text-gray-800 text-lg" colSpan="2">
                        Total
                      </td>
                      <td className="p-5 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 font-bold text-white text-lg border-2 border-blue-700 shadow-md">
                          {totalQty}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="font-bold text-xl text-green-700">
                          {totalPrice.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-500">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h4 className="text-2xl font-bold text-gray-800">Order Summary</h4>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <table className="w-full">
                  <tbody className="space-y-3">
                    <tr className="border-b border-gray-200">
                      <td className="font-bold py-4 text-gray-700 w-full">Name</td>
                      <td className="py-4 text-gray-900 font-medium text-end">{orderData?.data?.name}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-bold py-4 text-gray-700 w-full">Email</td>
                      <td className="py-4 text-gray-900 font-medium text-end">{orderData?.data?.email}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-bold py-4 text-gray-700 w-full">Phone</td>
                      <td className="py-4 text-gray-900 font-medium text-end">{orderData?.data?.phone}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-bold py-4 text-gray-700 w-full">Country</td>
                      <td className="py-4 text-gray-900 font-medium text-end">{orderData?.data?.country}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-bold py-4 text-gray-700 w-full">State</td>
                      <td className="py-4 text-gray-900 font-medium text-end">{orderData?.data?.state}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-bold py-4 text-gray-700 w-full">City</td>
                      <td className="py-4 text-gray-900 font-medium text-end">{orderData?.data?.city}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-bold py-4 text-gray-700 w-full">Pincode</td>
                      <td className="py-4 text-gray-900 font-medium text-end">{orderData?.data?.pincode}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-bold py-4 text-gray-700 w-full">Address</td>
                      <td className="py-4 text-gray-900 font-medium text-end">{orderData?.data?.landmark}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="font-bold py-4 text-gray-700 w-full">Order Note</td>
                      <td className="py-4 text-gray-900 font-medium text-end">{orderData?.data?.ordernote || '---'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>


            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-500">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h4 className="text-2xl font-bold text-gray-800">Shipping Address</h4>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <table className="w-full">
                  <tbody className="space-y-3">
                    
                    <tr className="border-b border-gray-200  ">
                      <td className="font-bold py-4 text-gray-700 w-full">Subtotal</td>
                      <td className="py-4 text-gray-900 font-medium">{orderData?.data?.subtotal.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}</td>
                    </tr>

                    <tr className="border-b border-gray-200">
                      <td className="font-bold py-4 text-gray-700 w-full">Discount</td>
                      <td className="py-4 text-gray-900 font-medium">{orderData?.data?.discount.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}</td>
                    </tr>

                    <tr className="border-b border-gray-200">
                      <td className="font-bold py-4 text-gray-700 w-full">Coupon Discount</td>
                      <td className="py-4 text-gray-900 font-medium">{orderData?.data?.couponDiscountAmount.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}</td>
                    </tr>

                    <tr className="border-b border-gray-200">
                      <td className="font-bold py-4 text-gray-700 w-full">Total</td>
                      <td className="py-4 text-gray-900 font-medium">{orderData?.data?.totalAmount.toLocaleString('en-PK', { style: "currency", currency: 'PKR' })}</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default OrderDetails