import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const navLinks = [
  { name: "Home", href: "/", order: 0 },
  {
    name: "Tickets & Parks",
    href: "#",
    order: 1,
    subLinks: [
      { name: "Disneyland", href: "/tickets/disneyland", order: 0 },
      { name: "Water Park", href: "/tickets/water-park", order: 1 },
      { name: "Adventure Park", href: "/tickets/adventure-park", order: 2 },
      { name: "City Pass", href: "/tickets/city-pass", order: 3 },
      { name: "Universal Studios", href: "/tickets/universal-studios", order: 4 },
      { name: "Sea World", href: "/tickets/sea-world", order: 5 },
      { name: "Other Parks", href: "/tickets/other-parks", order: 6 },
    ],
  },
  {
    name: "Bills & Payments",
    href: "#",
    order: 2,
    subLinks: [
      { name: "Utility Bills", href: "/bills/utility", order: 0 },
      { name: "House/Apartment Rental", href: "/bills/apartment-rental", order: 1 },
    ],
  },
  {
    name: "Travel",
    href: "#",
    order: 3,
    subLinks: [
      { name: "Flight", href: "/travel/flight", order: 0 },
      { name: "Car Rental", href: "/travel/car-rental", order: 1 },
      { name: "Hotel", href: "/travel/hotel", order: 2 },
      { name: "Train", href: "/travel/train", order: 3 },
      { name: "Bus", href: "/travel/bus", order: 4 },
      { name: "Cruise", href: "/travel/cruise", order: 5 },
    ],
  },
  { name: "IKEA", href: "/others/ikea", order: 4 },
  {
    name: "Others",
    href: "#",
    order: 5,
    subLinks: [
      { name: "Food & Grocery", href: "/others/food-grocery", order: 0 },
      { name: "FAQ", href: "/faq", order: 1 },
    ],
  },
  {
    name: "Blog",
    href: "/blog",
    order: 6
  },
]

async function main() {
  console.log("Seeding navbar links...")
  
  // Clear existing links
  // @ts-ignore
  await prisma.navbarLink?.deleteMany({})

  for (const link of navLinks) {
    // @ts-ignore
    const created = await prisma.navbarLink?.create({
      data: {
        name: link.name,
        href: link.href,
        order: link.order,
        subLinks: link.subLinks ? {
          create: link.subLinks.map(sub => ({
            name: sub.name,
            href: sub.href,
            order: sub.order
          }))
        } : undefined
      }
    })
    console.log(`Created link: ${created.name}`)
  }
  
  console.log("Seeding completed.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
