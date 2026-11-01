import { ClientLayout } from "./client-layout"
import { AdminClientWrapper } from "./client-wrapper"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

import { Toaster as RadixToaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <AdminClientWrapper session={session}>
      <ClientLayout>{children}</ClientLayout>
      <RadixToaster />
      <SonnerToaster />
    </AdminClientWrapper>
  )
}
