import { Button } from "@/components/ui/button"

export default function TestVisitors() {
  async function incrementVisitors() {
    try {
      const response = await fetch('/api/admin/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      console.log('Increment response:', data)
      getVisitorCounts()
    } catch (error) {
      console.error('Error incrementing visitors:', error)
    }
  }

  async function getVisitorCounts() {
    try {
      const response = await fetch('/api/admin/visitors')
      const data = await response.json()
      console.log('Visitor counts:', data)
    } catch (error) {
      console.error('Error getting visitor counts:', error)
    }
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Test Visitor Tracking</h1>
      <div className="space-x-4">
        <Button onClick={incrementVisitors}>
          Increment Visitors
        </Button>
        <Button variant="outline" onClick={getVisitorCounts}>
          Get Visitor Counts
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Check the browser console to see the responses
      </p>
    </div>
  )
} 