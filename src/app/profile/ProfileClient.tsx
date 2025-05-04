"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Edit, MapPin, Mail, Phone, Calendar, Shield, Award, ChevronRight } from 'lucide-react'
import { User } from "@/types/user"
import { getCurrentUser, updateUserProfile } from "../actions/auth-actions"
import { toast } from "sonner"
import ProfileEditDialog from "@/components/layout/ProfileEditDialog"
export interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  address?: string;
  created_at: string;
}

export default function ProfilePage({user}: {user: User}) {
  const [isHovering, setIsHovering] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    setProfile(user as UserProfile)
  }, [user])
  

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    try {
      const user = await getCurrentUser();
  
      
      if (!user || !user.user_id) {
        toast.error("User not found");
        return;
      }
  
      const formData = new FormData();
      formData.append("first_name", updatedProfile.first_name || "");
      formData.append("last_name", updatedProfile.last_name || "");
      formData.append("phone", updatedProfile.phone || "");
      formData.append("address", updatedProfile.address || "");
  
      const {error} = await updateUserProfile(user?.user_id ?? "", formData);
      
      if (error) {
        console.log(error);
        
        toast.error("Could not update your profile");
        return;
      }
      setProfile(updatedProfile);
      toast.success("Your profile has been updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Could not update your profile");
    }
  };

  console.log(profile);
  
  

  return (
    <>
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="relative mb-12 mt-8">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-center relative z-10 text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            My Profile
          </motion.h1>
          <motion.p
            className="text-center text-gray-600 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Manage your personal information
          </motion.p>
        </div>

        {/* Main profile content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Avatar and status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="md:col-span-1"
          >
            <Card className="overflow-hidden border-none shadow-md">
              <div className="h-32 bg-gray-200"></div>
              <CardContent className="p-0">
                <div className="flex flex-col items-center -mt-16 p-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onHoverStart={() => setIsHovering(true)}
                    onHoverEnd={() => setIsHovering(false)}
                    className="relative"
                  >
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                      <AvatarImage src="/placeholder.svg?height=128&width=128" alt="User" />
                      <AvatarFallback className="text-3xl bg-gray-800 text-white">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    {isHovering && (
                      <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                        <Edit className="text-white h-8 w-8" />
                      </div>
                    )}
                  </motion.div>

                  <h2 className="text-2xl font-bold mt-4">{profile?.first_name + " " + profile?.last_name ?? ""}</h2>
                  {/* <p className="text-gray-500">{}</p> */}

                  <div className="flex gap-2 mt-3">
                    <Badge className="bg-gray-800 hover:bg-gray-900">
                      Premium
                    </Badge>
                    <Badge variant="outline" className="border-gray-300 text-gray-700">
                      Verified
                    </Badge>
                  </div>

                  <Button className="w-full mt-6 bg-gray-900 hover:bg-black text-white" onClick={() => setIsEditDialogOpen(true)}>
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right column - profile details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="md:col-span-2"
          >
            <Card className="border-none shadow-md h-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Personal Information</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem
                      icon={<Mail className="h-5 w-5 text-gray-700" />}
                      label="Email Address"
                      value={profile?.email ?? ""}
                    />

                    <InfoItem
                      icon={<Phone className="h-5 w-5 text-gray-700" />}
                      label="Phone Number"
                      value={profile?.phone || ''}
                    />

                    <InfoItem
                      icon={<MapPin className="h-5 w-5 text-gray-700" />}
                      label="Location"
                      value={profile?.address || ''}
                    />

                    <InfoItem icon={<Calendar className="h-5 w-5 text-gray-700" />} label="Joined" value={new Date(user.created_at || '').toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        })} />
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Address</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {profile?.address || ""}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Account Settings</h3>

                    <div className="space-y-3">
                      <SettingsItem
                        icon={<Shield className="h-5 w-5 text-gray-700" />}
                        title="Privacy Settings"
                        description="Manage your data and privacy preferences"
                      />

                      <SettingsItem
                        icon={<Award className="h-5 w-5 text-gray-700" />}
                        title="Subscribe food"
                        description="Daily get fresh food"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
    {isEditDialogOpen && profile && (
      <ProfileEditDialog profile={profile} onClose={() => setIsEditDialogOpen(false)} onSave={handleProfileUpdate} />
    )}
    </>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string}) {
  return (
    <motion.div
      className="flex items-start gap-3 group"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </motion.div>
  )
}

function SettingsItem({ icon, title, description }: {icon: React.ReactNode; title: string; description: string;}) {
  return (
    <motion.div
      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer group"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-white transition-colors">{icon}</div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-700 transition-colors" />
    </motion.div>
  )
}


