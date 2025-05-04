"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Users,
  Briefcase,
  Award,
  Clock,
} from "lucide-react"
import Image from "next/image"

const lucideIcons = {
  Users,
  Briefcase,
  Award,
  Clock,
}

const aboutData = {
  header: {
    title: "About PureFarm",
    description:
      "Empowering sustainable living through smart agricultural delivery and subscriptions.",
  },
  story: {
    title: "Our Story",
    paragraphs: [
      "Founded in 2024, PureFarm started with a mission to make fresh, organic produce accessible and affordable through technology-driven delivery systems.",
      "We connect local farmers directly with households using subscription-based deliveries, ensuring quality and timely supply while supporting rural communities.",
    ],
  },
  stats: [
    { icon: "Users", label: "Customers Served", value: "10K+" },
    { icon: "Briefcase", label: "Farms Connected", value: "250+" },
    { icon: "Award", label: "Freshness Guarantee", value: "100%" },
    { icon: "Clock", label: "On-Time Deliveries", value: "98%" },
  ],
  team: [
    {
      name: "Aswin Ko",
      role: "Co-Founder & Product Head",
      bio: "Leads product design and innovation at PureFarm. Passionate about sustainability and clean design.",
    },
    {
      name: "Sanu K Joseph",
      role: "Co-Founder & Backend Lead",
      bio: "Handles all backend operations including APIs, database management, and delivery logic optimization.",
    },
    {
      name: "Akshay Kumar",
      role: "Operations Manager",
      bio: "Coordinates logistics, farmer onboarding, and customer support for a seamless delivery experience.",
    },
  ],
  values: [
    {
      title: "Farm-to-Table Freshness",
      description:
        "We eliminate middlemen to ensure you get the freshest produce directly from local farms.",
    },
    {
      title: "Smart Subscription System",
      description:
        "Our delivery model runs on intelligent scheduling, ensuring timely and flexible deliveries.",
    },
    {
      title: "Community-Driven Impact",
      description:
        "We uplift rural communities by sourcing locally and fairly.",
    },
    {
      title: "Transparency & Trust",
      description:
        "From farm details to delivery tracking, we believe in full transparency with our customers.",
    },
  ],
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-20">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {aboutData.header.title}
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            {aboutData.header.description}
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {aboutData.story.title}
              </h2>
              {aboutData.story.paragraphs.map((text, i) => (
                <p key={i} className="text-gray-600 mb-4">
                  {text}
                </p>
              ))}
              <Button variant="outline" className="group">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
              <div className="flex flex-col items-center text-gray-500 text-sm">
                <img src="/banner2.jpg" alt="Farm" className="w-full h-full mb-2 object-cover aspect-video" />
              </div>
            </div>

          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {aboutData.stats.map((stat, index) => {
              const Icon = lucideIcons[stat.icon as keyof typeof lucideIcons]
              return (
                <Card key={index} className="border-none shadow-md">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                    <h3 className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.section>

        {/* Team */}
        {/* <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Meet the Core Team
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {aboutData.team.map((member, index) => (
              <Card key={index} className="border-none shadow-md">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <p className="text-sm text-gray-500">Profile image</p>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    Read more <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section> */}

        {/* Values */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {aboutData.values.map((value, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
