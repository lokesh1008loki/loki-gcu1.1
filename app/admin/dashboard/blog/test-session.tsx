"use client"

import { useSession } from "next-auth/react"

export default function TestSession() {
  const { data: session, status } = useSession()

  return (
    <div>
      <h2>Session Status: {status}</h2>
      <pre>
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  )
} 