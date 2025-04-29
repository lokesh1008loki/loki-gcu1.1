"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CityTime {
  city: string
  state: string
  timeZone: string
  timeZoneName: string
  currentTime: string
  currentDate: string
}

const cities: CityTime[] = [
  {
    city: "New York",
    state: "New York",
    timeZone: "America/New_York",
    timeZoneName: "EST",
    currentTime: "",
    currentDate: ""
  },
  {
    city: "Los Angeles",
    state: "California",
    timeZone: "America/Los_Angeles",
    timeZoneName: "PST",
    currentTime: "",
    currentDate: ""
  },
  {
    city: "Chicago",
    state: "Illinois",
    timeZone: "America/Chicago",
    timeZoneName: "CST",
    currentTime: "",
    currentDate: ""
  },
  {
    city: "Denver",
    state: "Colorado",
    timeZone: "America/Denver",
    timeZoneName: "MST",
    currentTime: "",
    currentDate: ""
  },
  {
    city: "Phoenix",
    state: "Arizona",
    timeZone: "America/Phoenix",
    timeZoneName: "MST",
    currentTime: "",
    currentDate: ""
  },
  {
    city: "Anchorage",
    state: "Alaska",
    timeZone: "America/Anchorage",
    timeZoneName: "AKST",
    currentTime: "",
    currentDate: ""
  },
  {
    city: "Honolulu",
    state: "Hawaii",
    timeZone: "Pacific/Honolulu",
    timeZoneName: "HST",
    currentTime: "",
    currentDate: ""
  },
  {
    city: "Miami",
    state: "Florida",
    timeZone: "America/New_York",
    timeZoneName: "EST",
    currentTime: "",
    currentDate: ""
  },
  {
    city: "Seattle",
    state: "Washington",
    timeZone: "America/Los_Angeles",
    timeZoneName: "PST",
    currentTime: "",
    currentDate: ""
  }
]

export function USATimeZones() {
  const [times, setTimes] = useState<CityTime[]>(cities)

  useEffect(() => {
    const updateTimes = () => {
      const updatedTimes = cities.map(city => {
        const now = new Date()
        const cityTime = new Date(now.toLocaleString("en-US", { timeZone: city.timeZone }))
        
        return {
          ...city,
          currentTime: cityTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
          }),
          currentDate: cityTime.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        }
      })
      
      setTimes(updatedTimes)
    }

    // Update immediately
    updateTimes()
    
    // Update every second
    const interval = setInterval(updateTimes, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>US Time Zones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {times.map((city) => (
            <div
              key={`${city.city}-${city.state}`}
              className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{city.city}</h3>
                  <p className="text-sm text-muted-foreground">{city.state}</p>
                  <p className="text-xs text-muted-foreground">{city.timeZoneName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-mono">{city.currentTime}</p>
                  <p className="text-sm text-muted-foreground">{city.currentDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 