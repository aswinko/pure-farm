"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  PackageCheck,
  CalendarClock,
  Truck,
  Users,
  Zap,
  CheckCircle,
} from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Our Services</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            At PureFarm, we provide powerful tools to manage, schedule, and optimize product subscriptions and delivery services.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {[
            {
              icon: <PackageCheck className="h-8 w-8 text-green-700" />,
              title: "Product Subscription",
              description:
                "Users can subscribe to recurring delivery of products like milk, eggs, and vegetables with custom scheduling.",
              features: ["Flexible Plans", "Auto-Renewal", "Pause/Resume Options"],
            },
            {
              icon: <CalendarClock className="h-8 w-8 text-green-700" />,
              title: "Smart Scheduling",
              description:
                "Automated delivery calendar with date-wise status tracking and updates for each customer subscription.",
              features: ["Date-Based Status", "Custom Time Slots", "SMS/Email Notifications"],
            },
            {
              icon: <Truck className="h-8 w-8 text-green-700" />,
              title: "Delivery Agent Dashboard",
              description:
                "Real-time delivery view for agents to update status, view routes, and manage assigned orders.",
              features: ["Status Management", "Filter by Date", "View Subscription Details"],
            },
            {
              icon: <Zap className="h-8 w-8 text-green-700" />,
              title: "Performance Insights",
              description:
                "Analyze delivery success rate, customer feedback, and product-wise performance across locations.",
              features: ["Analytics Dashboard", "Order Trends", "Delivery Heatmaps"],
            },
            {
              icon: <Users className="h-8 w-8 text-green-700" />,
              title: "Customer Management",
              description:
                "View customer details, manage their orders, delivery history and communication logs.",
              features: ["Order History", "Contact Info", "Address Book"],
            },
          ].map((service, index) => (
            <Card key={index} className="border-none shadow-md overflow-hidden">
              <CardContent className="p-6">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-700" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Button variant="outline" className="w-full group">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </motion.div>

        {/* Process Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid gap-6">
            {[
              {
                number: "01",
                title: "Browse Products",
                description:
                  "Explore a curated selection of fresh farm products available for subscription.",
              },
              {
                number: "02",
                title: "Customize Schedule",
                description:
                  "Choose your delivery frequency, duration, and pause/resume as needed.",
              },
              {
                number: "03",
                title: "Secure Payment",
                description:
                  "Pay securely via Razorpay with full order and subscription tracking.",
              },
              {
                number: "04",
                title: "Real-Time Tracking",
                description:
                  "Track your delivery status, update changes, or contact support anytime.",
              },
              {
                number: "05",
                title: "Enjoy Fresh Deliveries",
                description:
                  "Sit back and enjoy farm-fresh items delivered straight to your doorstep!",
              },
            ].map((step, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl font-bold text-green-100">{step.number}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="border-none shadow-md bg-green-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Start Your PureFarm Journey</h2>
              <p className="mb-6 text-green-100 max-w-lg mx-auto">
                Subscribe to farm-fresh deliveries, manage orders seamlessly, and support local farmers.
              </p>
              <Button className="bg-white text-green-700 hover:bg-gray-100">
                Explore Products
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}
