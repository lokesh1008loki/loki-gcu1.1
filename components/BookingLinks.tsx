"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const bookingLinks = [
  {
    title: "IKEA Booking",
    description: "Get up to 40% off on IKEA orders",
    image: "/ass/ikea.jpg",
    link: "/others/ikea",
    color: "from-blue-500 to-blue-700"
  },
  {
    title: "Flight Booking",
    description: "Find the best flight deals",
    image: "/ass/flight united.jpg",
    link: "/travel/flight",
    color: "from-green-500 to-green-700"
  },
  {
    title: "Disneyland",
    description: "Magical Disney experiences",
    image: "/ass/disneyland-02.jpg",
    link: "/tickets/disneyland",
    color: "from-purple-500 to-purple-700"
  },
  {
    title: "Hotel Booking",
    description: "Best hotel deals worldwide",
    image: "/ass/hotel.jpg",
    link: "/travel/hotel",
    color: "from-red-500 to-red-700"
  }
]

export function BookingLinks() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Book Your Next Adventure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bookingLinks.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <Link href={item.link} className="block">
                <div className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl bg-gradient-to-br ${item.color}`}>
                  {/* Image Container */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />
                  </div>
                  
                  {/* Content with Gradient Background */}
                  <div className="relative p-6 text-white">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm opacity-90 mb-16">{item.description}</p>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-white text-gray-900 py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-100 shadow-lg hover:shadow-xl"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 