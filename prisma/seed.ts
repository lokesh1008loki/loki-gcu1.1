import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default site settings if they don't exist
  // @ts-ignore - Prisma client type issue
  const existingSettings = await prisma.siteSettings.findFirst()
  
  if (!existingSettings) {
    // @ts-ignore - Prisma client type issue
    await prisma.siteSettings.create({
      data: {
        whatsappLink: "https://whatsapp.com",
        facebookLink: "https://facebook.com",
        instagramLink: "https://instagram.com",
        twitterLink: "https://twitter.com",
        phoneNumber: "+1 437 849 7841",
        email: "support@gocomfortusa.com",
      },
    })
    console.log('Default site settings created')
  } else {
    console.log('Site settings already exist')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 