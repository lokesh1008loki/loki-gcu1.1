import { ClientLayout } from "./client-layout"
import { AdminClientWrapper } from "./client-wrapper"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

import { Toaster } from "@/components/ui/toaster"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <AdminClientWrapper session={session}>
      <ClientLayout>{children}</ClientLayout>
      <Toaster />
    </AdminClientWrapper>
  )
}