import React from 'react'
import OrderConfirmationPage from './OrderConfirmationClient'
import Navbar from '@/components/layout/Navbar'

const Page = async () => {


  return (
    <>
        <Navbar />
      <OrderConfirmationPage />
    </>
  )
}

export default Page
