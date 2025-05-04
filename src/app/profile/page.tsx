import React from 'react'
import ProfilePage, { UserProfile } from './ProfileClient'
import Navbar from '@/components/layout/Navbar'
import { getCurrentUser } from '../actions/auth-actions'
import { redirect } from 'next/navigation'

const page = async () => {
  const user = await getCurrentUser()
  if (!user){
    redirect("/")
  }
  return (
    <>
      <Navbar />
      <ProfilePage user={user} />
    </>
  )
}

export default page
