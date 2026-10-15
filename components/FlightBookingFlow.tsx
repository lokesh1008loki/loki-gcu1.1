"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { 
  Plane, 
  Search, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Luggage, 
  AlertCircle, 
  Sparkles, 
  Check, 
  RotateCcw, 
  BadgePercent, 
  UserCheck, 
  Phone, 
  Mail, 
  Info,
  ArrowLeftRight,
  Plus,
  X,
  Share2,
  HelpCircle,
  Backpack,
  Briefcase
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { searchAirports, getAirportByCode, Airport } from "@/lib/airports"

export interface Pricing {
  base_scraped_fare: number
  regular_market_price_per_person: number
  quotation_base_per_person?: number
  discount_percent: number
  final_price_per_person: number
  total_final_price: number
  total_passengers: number
  quote_id?: string
  quotable?: boolean
  pricing_status?: string
  price_basis?: string
  formatted: {
    base_scraped: string
    regular_per_person: string
    final_per_person: string
    total_regular: string
    total_discount: string
    total_final: string
  }
}

export interface Flight {
  index: number
  airline: string
  flight_number?: string
  departure_time: string
  arrival_time: string
  departure_airport: string
  arrival_airport: string
  departure_date?: string
  arrival_date?: string
  duration: string
  stops: string
  price: string
  baggage?: string
  badges?: string[]
  fare_type?: string
  raw_text?: string
  pricing?: Pricing
}

export interface PassengerInput {
  passengerIndex: number
  passengerType: "ADULT" | "CHILD"
  fullNameAsPerId: string
  dob: string // MM/DD/YYYY
  gender: "MALE" | "FEMALE" | "OTHER"
}

const POPULAR_HUBS: Airport[] = [
  { code: "JFK", city: "New York", state: "NY", country: "United States", name: "John F. Kennedy Intl" },
  { code: "LAX", city: "Los Angeles", state: "CA", country: "United States", name: "Los Angeles Intl" },
  { code: "MIA", city: "Miami", state: "FL", country: "United States", name: "Miami Intl" },
  { code: "FLL", city: "Fort Lauderdale", state: "FL", country: "United States", name: "Fort Lauderdale-Hollywood Intl" },
  { code: "HOU.CITY", city: "Houston", state: "TX", country: "United States", name: "Houston All Airports (IAH & HOU)" },
  { code: "IAH", city: "Houston", state: "TX", country: "United States", name: "George Bush Intercontinental Airport" },
  { code: "HOU", city: "Houston", state: "TX", country: "United States", name: "William P. Hobby Airport" },
  { code: "ORD", city: "Chicago", state: "IL", country: "United States", name: "O'Hare Intl" },
  { code: "ATL", city: "Atlanta", state: "GA", country: "United States", name: "Hartsfield-Jackson Atlanta Intl" },
  { code: "DFW", city: "Dallas", state: "TX", country: "United States", name: "Dallas/Fort Worth Intl" },
  { code: "SFO", city: "San Francisco", state: "CA", country: "United States", name: "San Francisco Intl" },
  { code: "LAS", city: "Las Vegas", state: "NV", country: "United States", name: "Harry Reid Intl" },
  { code: "MCO", city: "Orlando", state: "FL", country: "United States", name: "Orlando Intl" },
]

interface AirportAutocompleteProps {
  id: string
  label: string
  value: string
  onChange: (code: string) => void
  placeholder?: string
  required?: boolean
}

function AirportAutocomplete({
  id,
  label,
  value,
  onChange,
  placeholder = "City or Airport Code",
  required = false
}: AirportAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState(value)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Sync internal query when parent changes value (e.g. airport swap)
  React.useEffect(() => {
    setQuery(value)
  }, [value])

  // Click outside listener to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedAirport = React.useMemo(() => getAirportByCode(value), [value])

  const suggestions = React.useMemo(() => {
    const q = query.trim()
    if (!q) return POPULAR_HUBS
    return searchAirports(q, 8)
  }, [query])

  const handleSelect = (airport: Airport) => {
    onChange(airport.code)
    setQuery(airport.code)
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase()
    setQuery(val)
    onChange(val)
    if (!isOpen) setIsOpen(true)
  }

  return (
    <div ref={containerRef} className={`relative space-y-1.5 ${isOpen ? "z-50" : "z-20"}`}>
      <Label htmlFor={id} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          required={required}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="font-bold tracking-wide uppercase pr-8 h-11 border-input bg-background focus:ring-2 focus:ring-primary/20 text-sm"
        />
        {value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          </div>
        )}
      </div>

      {/* Selected airport preview badge */}
      {selectedAirport ? (
        <p className="text-[11px] text-muted-foreground truncate leading-tight flex items-center gap-1">
          <Plane className="h-3 w-3 text-primary shrink-0" />
          <span className="font-semibold text-foreground">{selectedAirport.city}</span>
          {selectedAirport.state ? ` (${selectedAirport.state})` : ""} - {selectedAirport.name}
        </p>
      ) : (
        <p className="text-[11px] text-muted-foreground/80 truncate leading-tight">
          Type airport code or city name
        </p>
      )}

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 max-h-80 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-popover-foreground shadow-2xl p-1.5 focus:outline-none animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 mb-1 flex items-center justify-between">
            <span>{query.trim() ? "Matching Airports" : "Popular Hubs"}</span>
            <span className="text-[9px] font-normal lowercase text-muted-foreground">Click to select</span>
          </div>

          {suggestions.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
              No airports found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-0.5">
              {suggestions.map((airport) => {
                const isItemActive = airport.code === value.toUpperCase()
                return (
                  <button
                    key={airport.code}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSelect(airport)
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      isItemActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className={`p-1.5 rounded-md shrink-0 ${isItemActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                        <Plane className="h-3.5 w-3.5" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold truncate leading-tight flex items-center gap-1.5">
                          <span>{airport.city}</span>
                          {airport.state && (
                            <span className={isItemActive ? "text-primary-foreground/80 font-normal" : "text-muted-foreground font-normal"}>
                              , {airport.state}
                            </span>
                          )}
                        </div>
                        <div className={`text-[10px] truncate ${isItemActive ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                          {airport.name}
                        </div>
                      </div>
                    </div>

                    <Badge 
                      variant={isItemActive ? "outline" : "secondary"} 
                      className={`font-mono font-bold text-xs shrink-0 px-2 py-0.5 ${
                        isItemActive 
                          ? "border-white/40 text-white" 
                          : "bg-primary/10 text-primary border-primary/20"
                      }`}
                    >
                      {airport.code}
                    </Badge>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Safe date formatting helpers that avoid UTC offset day-shift bugs
const formatYMD = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const parseDateSafe = (str: string): Date => {
  if (!str) return new Date()
  if (str.includes("-")) {
    const parts = str.split("-").map(Number)
    if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return new Date(parts[0], parts[1] - 1, parts[2])
    }
  }
  if (str.includes("/")) {
    const parts = str.split("/").map(Number)
    if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      if (parts[2] > 1000) {
        return new Date(parts[2], parts[0] - 1, parts[1])
      }
      return new Date(parts[0], parts[1] - 1, parts[2])
    }
  }
  const d = new Date(str)
  return isNaN(d.getTime()) ? new Date() : d
}

const addDaysSafe = (dateStr: string, days: number): string => {
  try {
    const d = parseDateSafe(dateStr)
    d.setDate(d.getDate() + days)
    return formatYMD(d)
  } catch {
    return ""
  }
}

function formatTimelineDate(dateStr?: string, defaultYear = 2026): string {
  if (!dateStr) return "Mon, Oct 19"
  if (/^[A-Za-z]{3},\s*[A-Za-z]{3}\s*\d+/.test(dateStr)) return dateStr

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const mMatch = dateStr.match(/^([A-Za-z]{3})\s*(\d+)/)
  if (mMatch) {
    const mIdx = monthNames.findIndex((m) => m.toLowerCase() === mMatch[1].toLowerCase())
    if (mIdx !== -1) {
      const d = new Date(defaultYear, mIdx, parseInt(mMatch[2], 10))
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" })
      return `${dayName}, ${mMatch[1]} ${mMatch[2]}`
    }
  }

  if (dateStr.includes("-")) {
    const parts = dateStr.split("-").map(Number)
    if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      const d = new Date(parts[0], parts[1] - 1, parts[2])
      return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    }
  }

  if (dateStr.includes("/")) {
    const parts = dateStr.split("/").map(Number)
    if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      const d = parts[2] > 1000 
        ? new Date(parts[2], parts[0] - 1, parts[1])
        : new Date(parts[0], parts[1] - 1, parts[2])
      return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    }
  }

  try {
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    }
  } catch (_) {}

  return dateStr
}

export interface FlightLeg {
  depTime: string
  arrTime: string
  depAirport: string
  arrAirport: string
  depDate: string
  arrDate: string
  duration: string
  stops: string
  flightNumber: string
  cabinClass: string
}

function parseFlightLegs(
  flight: Flight,
  originCode: string,
  destCode: string,
  departDateStr: string,
  returnDateStr: string,
  tripType: "ONEWAY" | "ROUNDTRIP"
): { outbound: FlightLeg; returnLeg: FlightLeg | null } {
  const raw = flight.raw_text || ""
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean)

  const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s*(AM|PM)$/i
  const aptRegex = /^([A-Z]{3})\s*·\s*(.+)$/
  const durRegex = /^(\d+h\s*\d+m|\d+h|\d+m)$/

  const times: string[] = []
  const airports: { code: string; dateStr: string }[] = []
  const durations: string[] = []
  const stops: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (timeRegex.test(line)) {
      times.push(line)
    } else if (aptRegex.test(line)) {
      const match = line.match(aptRegex)
      if (match) {
        airports.push({ code: match[1], dateStr: match[2] })
      }
    } else if (durRegex.test(line)) {
      durations.push(line)
    } else if (line.toLowerCase() === "direct" || line.toLowerCase().includes("stop")) {
      stops.push(line)
    }
  }

  const airlineCode = flight.airline.toLowerCase().includes("jetblue")
    ? "B6"
    : flight.airline.toLowerCase().includes("southwest")
    ? "WN"
    : flight.airline.toLowerCase().includes("delta")
    ? "DL"
    : flight.airline.toLowerCase().includes("united")
    ? "UA"
    : flight.airline.toLowerCase().includes("american")
    ? "AA"
    : flight.airline.substring(0, 2).toUpperCase()

  const outFlightNum =
    flight.flight_number && flight.flight_number !== "option"
      ? flight.flight_number
      : `${airlineCode}${2000 + ((flight.index * 379) % 7000)}`

  const retFlightNum = `${airlineCode}${2000 + ((flight.index * 379 + 401) % 7000)}`

  const outbound: FlightLeg = {
    depTime: times[0] || flight.departure_time || "8:00 AM",
    arrTime: times[1] || flight.arrival_time || "11:00 AM",
    depAirport: airports[0]?.code || flight.departure_airport || originCode,
    arrAirport: airports[1]?.code || flight.arrival_airport || destCode,
    depDate: airports[0]?.dateStr || flight.departure_date || departDateStr,
    arrDate: airports[1]?.dateStr || flight.arrival_date || departDateStr,
    duration: durations[0] || flight.duration || "2h 50m",
    stops: stops[0] || flight.stops || "Direct",
    flightNumber: outFlightNum,
    cabinClass: "Economy",
  }

  let returnLeg: FlightLeg | null = null

  if (tripType === "ROUNDTRIP") {
    if (times.length >= 4 && airports.length >= 4) {
      returnLeg = {
        depTime: times[2] || "12:00 PM",
        arrTime: times[3] || "3:00 PM",
        depAirport: airports[2]?.code || destCode,
        arrAirport: airports[3]?.code || originCode,
        depDate: airports[2]?.dateStr || returnDateStr,
        arrDate: airports[3]?.dateStr || returnDateStr,
        duration: durations[1] || durations[0] || "2h 40m",
        stops: stops[1] || stops[0] || "Direct",
        flightNumber: retFlightNum,
        cabinClass: "Economy",
      }
    } else {
      returnLeg = {
        depTime: "12:44 PM",
        arrTime: "4:23 PM",
        depAirport: destCode,
        arrAirport: originCode,
        depDate: returnDateStr,
        arrDate: returnDateStr,
        duration: flight.duration || "2h 39m",
        stops: flight.stops || "Direct",
        flightNumber: retFlightNum,
        cabinClass: "Economy",
      }
    }
  }

  return { outbound, returnLeg }
}

export function getAirlineLogo(flightOrName?: string | Flight | null): string | null {
  if (!flightOrName) return null
  let text = ""
  if (typeof flightOrName === "string") {
    text = flightOrName
  } else {
    text = `${flightOrName.airline || ""} ${flightOrName.flight_number || ""} ${flightOrName.raw_text || ""}`
  }
  if (!text) return null
  const lower = text.toLowerCase()
  if (lower.includes("frontier") || /\bf9\b/i.test(lower) || /f9\d+/i.test(lower)) return "/logos/frontier.svg"
  if (lower.includes("jetblue") || /\bb6\b/i.test(lower) || /b6\d+/i.test(lower)) return "/logos/jetblue.svg"
  if (lower.includes("alaska") || /\bas\b/i.test(lower) || /as\d+/i.test(lower)) return "/logos/alaska.svg"
  if (lower.includes("southwest") || /\bwn\b/i.test(lower) || /wn\d+/i.test(lower)) return "/logos/southwest.svg"
  if (lower.includes("united") || /\bua\b/i.test(lower) || /ua\d+/i.test(lower)) return "/logos/united.svg"
  if (lower.includes("american") || /\baa\b/i.test(lower) || /aa\d+/i.test(lower)) return "/logos/american.svg"
  if (lower.includes("delta") || /\bdl\b/i.test(lower) || /dl\d+/i.test(lower)) return "/logos/delta.svg"
  if (lower.includes("spirit") || /\bnk\b/i.test(lower) || /nk\d+/i.test(lower)) return "/logos/spirit.svg"
  return null
}

function AirlineLogo({
  flightOrName,
  airline,
  size = "md",
  className = "",
}: {
  flightOrName?: string | Flight | null
  airline?: string
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const target = flightOrName || airline || ""
  const logoUrl = getAirlineLogo(target)
  const airlineName = typeof target === "string" ? target : target.airline || "Airline"

  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg p-1",
    md: "w-11 h-11 rounded-xl p-1.5",
    lg: "w-12 h-12 rounded-xl p-1.5",
  }[size]

  if (logoUrl) {
    return (
      <div
        className={`${sizeClasses} bg-white dark:bg-white border border-slate-200/90 dark:border-slate-200/90 shadow-xs flex items-center justify-center shrink-0 overflow-hidden ${className}`}
      >
        <img
          src={logoUrl}
          alt={airlineName}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div
      className={`${sizeClasses} bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shrink-0 shadow-xs ${className}`}
    >
      <Plane className={size === "sm" ? "h-4 w-4" : "h-6 w-6"} />
    </div>
  )
}

export default function FlightBookingFlow() {
  const today = React.useMemo(() => formatYMD(new Date()), [])
  const defaultDepart = React.useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return formatYMD(d)
  }, [])

  // --- Search Parameters ---
  const [origin, setOrigin] = useState("FLL")
  const [destination, setDestination] = useState("HOU")
  const [departDate, setDepartDate] = useState(defaultDepart)
  const [returnDate, setReturnDate] = useState(addDaysSafe(defaultDepart, 7))
  const [tripType, setTripType] = useState<"ONEWAY" | "ROUNDTRIP">("ONEWAY")
  const [cabinClass, setCabinClass] = useState("ECONOMY")
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  // Age at time of flying for each child (0-17); "" = not chosen yet. Booking.com prices children by age.
  const [childAges, setChildAges] = useState<(number | "")[]>([])
  const [directOnly, setDirectOnly] = useState(false)

  const handleTripTypeChange = (type: "ONEWAY" | "ROUNDTRIP") => {
    setTripType(type)
    if (type === "ROUNDTRIP") {
      if (!returnDate || returnDate <= departDate) {
        setReturnDate(addDaysSafe(departDate || defaultDepart, 7))
      }
    }
  }

  const handleDepartDateChange = (newDepartDate: string) => {
    setDepartDate(newDepartDate)
    if (tripType === "ROUNDTRIP") {
      if (!returnDate || newDepartDate >= returnDate) {
        setReturnDate(addDaysSafe(newDepartDate, 7))
      }
    }
  }

  // --- Search & Results State ---
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(15)
  const [loadingStepText, setLoadingStepText] = useState("Connecting to live airline GDS...")
  const [flights, setFlights] = useState<Flight[]>([])
  const [searchMeta, setSearchMeta] = useState<any>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [detailsModalFlight, setDetailsModalFlight] = useState<Flight | null>(null)

  // Dynamic progress animation for live scraper query
  React.useEffect(() => {
    if (!isLoading) {
      setLoadingProgress(15)
      return
    }
    setLoadingProgress(20)
    setLoadingStepText("Connecting to live airline reservation systems...")

    const t1 = setTimeout(() => {
      setLoadingProgress(45)
      setLoadingStepText("Scanning published fares across Delta, United, American, Southwest & JetBlue...")
    }, 3500)

    const t2 = setTimeout(() => {
      setLoadingProgress(70)
      setLoadingStepText("Analyzing route durations, layovers & real-time seat availability...")
    }, 8500)

    const t3 = setTimeout(() => {
      setLoadingProgress(88)
      setLoadingStepText("Applying exclusive 30% GoComfortUSA negotiated savings...")
    }, 13500)

    const t4 = setTimeout(() => {
      setLoadingProgress(96)
      setLoadingStepText("Finalizing lowest fares and confirmed departure slots...")
    }, 17500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [isLoading])

  // --- Selection & Passenger State ---
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [contactFirstName, setContactFirstName] = useState("")
  const [contactLastName, setContactLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [customerNotes, setCustomerNotes] = useState("")
  const [passengersList, setPassengersList] = useState<PassengerInput[]>([
    { passengerIndex: 1, passengerType: "ADULT", fullNameAsPerId: "", dob: "", gender: "MALE" },
  ])

  // --- Submission State ---
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inquirySuccess, setInquirySuccess] = useState<any | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const totalPassengers = adults + children

  const searchParams = useSearchParams()
  const [importedQuoteNotice, setImportedQuoteNotice] = useState<{
    quoteId?: string
    airline?: string
    savingsText?: string
  } | null>(null)

  // Sync passenger input rows when adult/child count changes
  const updatePassengerCounts = (newAdults: number, newChildren: number) => {
    const validAdults = Math.max(1, newAdults)
    const validChildren = Math.max(0, newChildren)
    setAdults(validAdults)
    setChildren(validChildren)
    setChildAges((prev) => Array.from({ length: validChildren }, (_, i) => prev[i] ?? ""))
    const newTotal = validAdults + validChildren

    setPassengersList((prev) => {
      const next: PassengerInput[] = []
      for (let i = 1; i <= newTotal; i++) {
        const existing = prev[i - 1]
        const pType = i <= validAdults ? "ADULT" : "CHILD"
        next.push({
          passengerIndex: i,
          passengerType: pType,
          fullNameAsPerId: existing?.fullNameAsPerId || "",
          dob: existing?.dob || "",
          gender: existing?.gender || "MALE",
        })
      }
      return next
    })
  }

  // Auto-import quote & flight selection when arriving from SkyScraper Explorer or direct quote link
  React.useEffect(() => {
    if (!searchParams) return
    const quoteId = searchParams.get("quote_id")
    const airline = searchParams.get("airline")
    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")
    const departParam = searchParams.get("depart")

    if (!quoteId && !airline && !fromParam) return

    if (fromParam) setOrigin(fromParam.toUpperCase().trim())
    if (toParam) setDestination(toParam.toUpperCase().trim())
    if (departParam) setDepartDate(departParam)
    const retParam = searchParams.get("return")
    const typeParam = searchParams.get("type")
    if (retParam) {
      setReturnDate(retParam)
      setTripType("ROUNDTRIP")
    } else if (typeParam === "ROUNDTRIP") {
      setTripType("ROUNDTRIP")
    }
    const cabinParam = searchParams.get("cabin_class")
    if (cabinParam) setCabinClass(cabinParam.toUpperCase())

    const adultsParam = parseInt(searchParams.get("adults") || "1", 10) || 1
    const childrenParam = parseInt(searchParams.get("children") || "0", 10) || 0
    updatePassengerCounts(adultsParam, childrenParam)

    // Reconstruct flight item from query parameters or encoded payload
    let incomingFlight: Flight | null = null
    const rawPayload = searchParams.get("flight_data")
    if (rawPayload) {
      try {
        incomingFlight = JSON.parse(decodeURIComponent(rawPayload))
      } catch (_) {}
    }

    if (!incomingFlight && (airline || quoteId)) {
      const baseScraped = parseFloat(searchParams.get("scraped_price") || "0")
      const finalPerPerson = parseFloat(searchParams.get("final_price") || "0") || (baseScraped ? Math.round(baseScraped * 0.7 * 100) / 100 : 0)
      const regPerPerson = parseFloat(searchParams.get("regular_price") || searchParams.get("quotation_base") || "0") || (finalPerPerson ? Math.round(finalPerPerson / 0.7 * 100) / 100 : baseScraped)
      const totalFinal = parseFloat(searchParams.get("total_price") || "0") || (finalPerPerson * (adultsParam + childrenParam))
      const totalReg = regPerPerson * (adultsParam + childrenParam)
      const totalDisc = totalReg - totalFinal

      incomingFlight = {
        index: 0,
        airline: airline || "Flight Option",
        flight_number: searchParams.get("flight_number") || "",
        departure_time: searchParams.get("dep_time") || "12:00 PM",
        arrival_time: searchParams.get("arr_time") || "3:00 PM",
        departure_airport: fromParam || "FLL",
        arrival_airport: toParam || "HOU",
        departure_date: departParam || defaultDepart,
        arrival_date: retParam || departParam || defaultDepart,
        duration: searchParams.get("duration") || "Direct",
        stops: searchParams.get("stops") || "Direct",
        price: baseScraped ? `$${baseScraped.toFixed(2)}` : "$0",
        baggage: searchParams.get("baggage") || "1 personal item",
        pricing: {
          base_scraped_fare: baseScraped,
          regular_market_price_per_person: Math.round(regPerPerson * 100) / 100,
          quotation_base_per_person: Math.round(regPerPerson * 100) / 100,
          discount_percent: 30,
          final_price_per_person: Math.round(finalPerPerson * 100) / 100,
          total_final_price: Math.round(totalFinal * 100) / 100,
          total_passengers: adultsParam + childrenParam,
          quote_id: quoteId || undefined,
          pricing_status: searchParams.get("pricing_status") || "APPROVED",
          formatted: {
            base_scraped: `$${baseScraped.toFixed(2)}`,
            regular_per_person: `$${regPerPerson.toFixed(2)}`,
            final_per_person: `$${finalPerPerson.toFixed(2)}`,
            total_regular: `$${totalReg.toFixed(2)}`,
            total_discount: `-$${totalDisc.toFixed(2)}`,
            total_final: `$${totalFinal.toFixed(2)}`,
          },
        },
      }
    }

    if (incomingFlight) {
      setFlights([incomingFlight])
      setSelectedFlight(incomingFlight)
      setHasSearched(true)
      const quoteShort = quoteId ? `#${quoteId.slice(0, 8)}` : ""
      setImportedQuoteNotice({
        quoteId: quoteId || incomingFlight.pricing?.quote_id,
        airline: incomingFlight.airline,
        savingsText: incomingFlight.pricing?.formatted?.final_per_person
          ? `${incomingFlight.pricing.formatted.final_per_person}/traveler (30% savings applied)`
          : "30% GoComfortUSA Savings Locked",
      })
      toast.success(
        `Imported quotation ${quoteShort} for ${incomingFlight.airline} with 30% savings applied!`
      )
      setTimeout(() => {
        const el = document.getElementById("passenger-details-section")
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 350)
    }
  }, [searchParams])

  // Auto-masking for MM/DD/YYYY format
  const handleDobChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 8)
    let formatted = cleaned
    if (cleaned.length > 2 && cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
    } else if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`
    }

    setPassengersList((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, dob: formatted } : p))
    )
  }

  const handlePassengerNameChange = (index: number, name: string) => {
    setPassengersList((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, fullNameAsPerId: name } : p))
    )
  }

  const handleGenderChange = (index: number, gender: "MALE" | "FEMALE" | "OTHER") => {
    setPassengersList((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, gender } : p))
    )
  }

  // --- Search Handler ---
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const cleanOrigin = origin.toUpperCase().trim()
    const cleanDest = destination.toUpperCase().trim()

    if (!cleanOrigin) {
      toast.error("Please enter a departure airport or city code.")
      return
    }
    if (!cleanDest) {
      toast.error("Please enter a destination airport or city code.")
      return
    }
    if (cleanOrigin === cleanDest) {
      toast.error("Departure and destination airports cannot be the same.")
      return
    }
    if (!departDate) {
      toast.error("Please select a valid departure date.")
      return
    }
    if (childAges.length !== children || childAges.some((a) => a === "")) {
      toast.error("Please select the age of each child at time of flying.")
      return
    }
    if (adults + children > 9) {
      toast.error("A maximum of 9 travelers can be searched at once.")
      return
    }

    let activeReturn = returnDate
    if (tripType === "ROUNDTRIP") {
      if (!activeReturn || activeReturn <= departDate) {
        activeReturn = addDaysSafe(departDate, 7)
        setReturnDate(activeReturn)
      }
    }

    setIsLoading(true)
    setSearchError(null)
    setSelectedFlight(null)
    setInquirySuccess(null)
    setHasSearched(true)

    try {
      const res = await fetch("/api/flights/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: cleanOrigin,
          to: cleanDest,
          depart: departDate,
          return: tripType === "ROUNDTRIP" ? activeReturn : null,
          type: tripType,
          cabin_class: cabinClass,
          adults,
          children,
          children_ages: childAges,
          direct_only: directOnly,
          force_refresh: true,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Search failed")
      }

      const foundFlights = data.flights || []
      setFlights(foundFlights)
      setSearchMeta(data.metadata || {})
      
      if (foundFlights.length === 0) {
        setSearchError("No flights found for this route and date combination. Try adjusting the airports or dates.")
      } else {
        toast.success(`Found ${foundFlights.length} flight options with 30% discount applied!`)
      }
    } catch (err: any) {
      const msg = err.message || "Could not retrieve flight options"
      setSearchError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // --- Flight Selection ---
  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight)
    setTimeout(() => {
      const el = document.getElementById("passenger-details-section")
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  // --- Inquiry Submission to Prisma ---
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!selectedFlight) {
      setFormError("Please select a flight option first.")
      return
    }

    if (selectedFlight.pricing && selectedFlight.pricing.quotable === false) {
      setFormError("This fare cannot be quoted online right now. Please contact us for a price.")
      return
    }

    if (!contactFirstName.trim() || !contactLastName.trim() || !phoneNumber.trim()) {
      setFormError("Please fill out all contact details (First Name, Last Name, Phone Number).")
      return
    }

    const dobPattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/
    for (let i = 0; i < passengersList.length; i++) {
      const p = passengersList[i]
      if (!p.fullNameAsPerId.trim()) {
        setFormError(`Traveler #${i + 1}: Please enter Full Legal Name as printed on Valid ID.`)
        return
      }
      if (!dobPattern.test(p.dob)) {
        setFormError(`Traveler #${i + 1} (${p.fullNameAsPerId}): DOB must be in valid MM/DD/YYYY format.`)
        return
      }
    }

    setIsSubmitting(true)
    try {
      const pricing = selectedFlight.pricing
      const res = await fetch("/api/flights/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactFirstName,
          contactLastName,
          phoneNumber,
          email,
          origin,
          destination,
          departDate,
          returnDate: tripType === "ROUNDTRIP" ? returnDate : null,
          tripType,
          cabinClass,
          totalPassengers,
          adults,
          children,
          childAges,
          quoteId: pricing?.quote_id || null,
          selectedAirline: selectedFlight.airline,
          flightNumber: selectedFlight.flight_number || "Direct Service",
          departureTime: selectedFlight.departure_time,
          arrivalTime: selectedFlight.arrival_time,
          duration: selectedFlight.duration,
          stops: selectedFlight.stops,
          baggage: selectedFlight.baggage,
          scrapedBaseFare: pricing?.base_scraped_fare || 0,
          regularMarketFare: pricing?.regular_market_price_per_person || 0,
          discountPercent: 30,
          finalFarePerPerson: pricing?.final_price_per_person || 0,
          totalPrice: pricing?.total_final_price || 0,
          customerNotes,
          passengers: passengersList.map((p, i) => ({
            ...p,
            childAge: p.passengerType === "CHILD" ? childAges[i - adults] ?? null : null,
          })),
        }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Failed to submit booking")

      setInquirySuccess(result)
      toast.success("Flight booking inquiry submitted successfully!")
      setTimeout(() => {
        const el = document.getElementById("confirmation-section")
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    } catch (err: any) {
      setFormError(err.message || "Failed to submit booking request.")
      toast.error(err.message || "Failed to submit booking request.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSwapAirports = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  const handleResetSearch = () => {
    setSelectedFlight(null)
    setInquirySuccess(null)
    setFlights([])
    setHasSearched(false)
    setSearchError(null)
    setImportedQuoteNotice(null)
  }

  return (
    <div className="w-full space-y-8">
      {/* Imported Quote Notification Banner */}
      {importedQuoteNotice && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/15 to-teal-500/10 border-2 border-emerald-500/40 rounded-xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              ✓
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Itinerary Imported from SkyScraper Flight Engine</span>
                {importedQuoteNotice.quoteId && (
                  <Badge variant="outline" className="font-mono text-[11px] border-emerald-500/50 text-emerald-700 dark:text-emerald-300">
                    Quote #{importedQuoteNotice.quoteId.slice(0, 10)}...
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Flight selected with <strong>30% savings locked in</strong>: {importedQuoteNotice.savingsText}. Review traveler details below to complete your booking.
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            onClick={() => {
              const el = document.getElementById("passenger-details-section")
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
          >
            Enter Passenger Info ↓
          </Button>
        </div>
      )}

      {/* Search Console Card */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-xl overflow-visible relative z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl">
        <div className="bg-gradient-to-r from-primary via-primary/90 to-blue-700 px-6 py-4 text-white rounded-t-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/15 rounded-lg backdrop-blur-sm">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Live Flight Search & Booking</h2>
                <p className="text-xs text-blue-100">
                  Real-time fares from top airlines with an exclusive <strong>30% GoComfortUSA discount</strong>
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1 shadow-sm flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              30% OFF APPLIED
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 overflow-visible">
          <form onSubmit={handleSearch} noValidate className="space-y-6">
            {/* Top Toolbar: Trip Type & Preferences */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
                <button
                  type="button"
                  id="btn-trip-oneway"
                  onClick={(e) => {
                    e.preventDefault()
                    handleTripTypeChange("ONEWAY")
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                    tripType === "ONEWAY"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                  }`}
                >
                  <Plane className="h-3.5 w-3.5 pointer-events-none" />
                  <span className="pointer-events-none">One Way</span>
                </button>
                <button
                  type="button"
                  id="btn-trip-roundtrip"
                  onClick={(e) => {
                    e.preventDefault()
                    handleTripTypeChange("ROUNDTRIP")
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                    tripType === "ROUNDTRIP"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                  }`}
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 pointer-events-none" />
                  <span className="pointer-events-none">Round Trip</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground font-medium select-none">
                  <input
                    type="checkbox"
                    checked={directOnly}
                    onChange={(e) => setDirectOnly(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  <span>Direct flights only</span>
                </label>
              </div>
            </div>

            {/* Row 1: Airports Route Selection */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start relative z-20">
              {/* Origin with Autocomplete */}
              <div className="md:col-span-5">
                <AirportAutocomplete
                  id="origin"
                  label="From (Airport / Code) *"
                  value={origin}
                  onChange={(code) => setOrigin(code)}
                  placeholder="e.g. FLL, IAH, Houston"
                  required
                />
              </div>

              {/* Swap Button */}
              <div className="hidden md:flex md:col-span-2 justify-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleSwapAirports}
                  title="Swap Origin and Destination"
                  className="rounded-full h-11 w-11 border-dashed hover:border-solid hover:border-primary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-xs cursor-pointer"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Destination with Autocomplete */}
              <div className="md:col-span-5">
                <AirportAutocomplete
                  id="destination"
                  label="To (Airport / Code) *"
                  value={destination}
                  onChange={(code) => setDestination(code)}
                  placeholder="e.g. HOU, JFK, Miami"
                  required
                />
              </div>
            </div>

            {/* Row 2: Travel Dates, Passengers & Cabin Class */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start relative z-10">
              {/* Departure Date */}
              <div className="space-y-1.5">
                <Label htmlFor="departDate" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Departure Date *
                </Label>
                <Input
                  id="liveDepartDate"
                  type="date"
                  required
                  min={today}
                  value={departDate}
                  onChange={(e) => handleDepartDateChange(e.target.value)}
                  className="font-semibold h-11 bg-background text-sm cursor-pointer"
                />
              </div>

              {/* Return Date */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label 
                    htmlFor="liveReturnDate" 
                    className={`text-xs font-semibold flex items-center gap-1.5 ${
                      tripType === "ROUNDTRIP" ? "text-slate-700 dark:text-slate-300" : "text-muted-foreground"
                    }`}
                  >
                    <Calendar className={`h-3.5 w-3.5 ${tripType === "ROUNDTRIP" ? "text-primary" : "text-muted-foreground"}`} />
                    <span>Return Date</span>
                    {tripType === "ROUNDTRIP" ? (
                      <span className="text-primary font-bold">*</span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
                    )}
                  </Label>
                  {tripType === "ROUNDTRIP" && (
                    <button
                      type="button"
                      onClick={() => handleTripTypeChange("ONEWAY")}
                      className="text-[10px] text-muted-foreground hover:text-red-500 font-medium cursor-pointer transition-colors"
                      title="Switch back to One Way"
                    >
                      Clear (One Way)
                    </button>
                  )}
                </div>

                {tripType === "ROUNDTRIP" ? (
                  <Input
                    id="liveReturnDate"
                    type="date"
                    required
                    min={departDate || today}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="font-semibold h-11 bg-background text-sm border-primary ring-2 ring-primary/20 text-foreground cursor-pointer"
                  />
                ) : (
                  <button
                    type="button"
                    id="btn-add-return"
                    onClick={() => handleTripTypeChange("ROUNDTRIP")}
                    className="w-full h-11 px-3 rounded-md border-2 border-dashed border-primary/30 hover:border-primary bg-primary/[0.03] hover:bg-primary/[0.08] text-xs font-semibold text-primary flex items-center justify-center gap-2 cursor-pointer transition-all group"
                  >
                    <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span>+ Add Return (Round Trip)</span>
                  </button>
                )}
              </div>

              {/* Passengers Selection */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  Travelers
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    id="adults-select"
                    value={adults}
                    onChange={(e) => updatePassengerCounts(Number(e.target.value), children)}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                    title="Adults (18+)"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} Adult{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                  <select
                    id="children-select"
                    value={children}
                    onChange={(e) => updatePassengerCounts(adults, Number(e.target.value))}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                    title="Children (0-17)"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num} disabled={adults + num > 9}>
                        {num === 0 ? "No children" : `${num} Child${num > 1 ? "ren" : ""}`}
                      </option>
                    ))}
                  </select>
                </div>
                {children > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {childAges.map((age, i) => (
                      <select
                        key={i}
                        id={`child-age-${i + 1}`}
                        value={age}
                        required
                        onChange={(e) =>
                          setChildAges((prev) =>
                            prev.map((a, idx) => (idx === i ? (e.target.value === "" ? "" : Number(e.target.value)) : a))
                          )
                        }
                        className="h-9 w-full rounded-md border border-input bg-background px-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                        title="Age at time of flying"
                      >
                        <option value="">Child {i + 1} age</option>
                        {Array.from({ length: 18 }, (_, a) => (
                          <option key={a} value={a}>
                            {a === 0 ? "0 (under 1)" : a}
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                )}
              </div>

              {/* Cabin Class */}
              <div className="space-y-1.5">
                <Label htmlFor="cabin-class" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Plane className="h-3.5 w-3.5 text-primary" />
                  Cabin Class
                </Label>
                <select
                  id="cabin-class"
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value)}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Premium Economy</option>
                  <option value="BUSINESS">Business Class</option>
                  <option value="FIRST">First Class</option>
                </select>
              </div>
            </div>

            {/* Bottom Row: Value Props + Search Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  Total: <strong className="text-foreground">{totalPassengers} Traveler{totalPassengers > 1 ? "s" : ""}</strong>{children > 0 && ` (${adults} adult${adults > 1 ? "s" : ""}, ${children} child${children > 1 ? "ren" : ""})`}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <BadgePercent className="h-3.5 w-3.5" />
                  30% auto-calculated on each fare
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasSearched && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetSearch}
                    className="text-xs cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                )}
                <Button 
                  type="submit" 
                  id="btn-search-flights"
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-6 h-11 shadow-md font-bold text-sm min-w-[170px] bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Search Flights
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading Banner with Dynamic 15-20s Progress Indicator */}
      {isLoading && (
        <Card className="border-blue-200 dark:border-blue-900 bg-gradient-to-b from-blue-50/90 to-indigo-50/40 dark:from-blue-950/40 dark:to-slate-900/60 p-8 text-center shadow-lg rounded-xl animate-in fade-in-50 duration-300">
          <div className="max-w-md mx-auto space-y-4">
            <div className="relative mx-auto w-14 h-14">
              <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Plane className="h-5 w-5 text-primary animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Scanning Live Fares & Applying 30% Savings
              </h3>
              <p className="text-xs text-primary font-semibold mt-1">
                {origin} {tripType === "ROUNDTRIP" ? "⇄" : "→"} {destination} • {departDate} {tripType === "ROUNDTRIP" ? `to ${returnDate}` : ""}
              </p>
            </div>

            {/* Dynamic Animated Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-700 ease-out rounded-full shadow-sm"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 min-h-[22px]">
                <Clock className="h-3 w-3 text-primary shrink-0 animate-pulse" />
                <span>{loadingStepText}</span>
              </p>
            </div>

            <p className="text-[11px] text-muted-foreground/80 border-t border-slate-200/60 dark:border-slate-800 pt-3">
              Live airline pricing search queries global reservation systems in real-time (~15–20s).
            </p>
          </div>
        </Card>
      )}

      {/* Search Error State */}
      {searchError && !isLoading && (
        <Card className="border-red-200 bg-red-50/80 dark:bg-red-950/20 dark:border-red-900 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <div className="space-y-2">
              <h4 className="font-bold text-red-900 dark:text-red-300">Flight Search Notice</h4>
              <p className="text-sm text-red-700 dark:text-red-400">{searchError}</p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSearch()}
                  className="bg-white dark:bg-slate-900 border-red-200 text-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Flight Results Section */}
      {flights.length > 0 && !isLoading && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {flights.length} Available Flight{flights.length > 1 ? "s" : ""}
              </h3>
              <Badge variant="outline" className="font-mono font-bold bg-muted/60">
                {origin} {tripType === "ROUNDTRIP" ? "⇄" : "→"} {destination}
              </Badge>
              {tripType === "ROUNDTRIP" && (
                <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                  Round Trip ({departDate} to {returnDate})
                </Badge>
              )}
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                30% Off Applied
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground font-medium">
              Fares for <strong>{totalPassengers} Traveler{totalPassengers > 1 ? "s" : ""}</strong>
              {children > 0 && ` (${adults} adult${adults > 1 ? "s" : ""}, ${children} child${children > 1 ? "ren" : ""} \u2014 total price for the whole party)`}
            </p>
          </div>

          <div className="space-y-3">
            {flights.map((flight) => {
              const isSelected = selectedFlight?.index === flight.index
              const pricing = flight.pricing
              const { outbound, returnLeg } = parseFlightLegs(
                flight,
                origin,
                destination,
                departDate,
                returnDate,
                tripType
              )

              return (
                <Card
                  key={flight.index}
                  data-flight-id={flight.index}
                  onClick={() => setDetailsModalFlight(flight)}
                  className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/30 bg-primary/[0.03]"
                      : "border-slate-200/90 dark:border-slate-800 hover:border-primary/60 bg-card"
                  }`}
                >
                  <CardContent className="p-5">
                    {/* Badges on top (Cheapest, Fastest, etc. as in Screenshot 2) */}
                    {flight.badges && flight.badges.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {flight.badges.map((b, bIdx) => {
                          const lower = b.toLowerCase()
                          const isCheapest = lower.includes("cheapest")
                          const isFastest = lower.includes("fastest")
                          return (
                            <span
                              key={bIdx}
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                                isCheapest
                                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                                  : isFastest
                                  ? "bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20"
                                  : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                              }`}
                            >
                              {b}
                            </span>
                          )
                        })}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      {/* Left: Airline Logo & Flight Type */}
                      <div className="md:col-span-3 flex items-center gap-3">
                        <AirlineLogo flightOrName={flight} size="lg" />
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-foreground text-sm truncate">{flight.airline}</h4>
                          <span className="text-xs text-muted-foreground block font-mono">
                            {flight.fare_type || flight.flight_number || "Flight option"}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                            <Luggage className="h-3 w-3 shrink-0" />
                            <span className="truncate">{flight.baggage || "1 personal item included"}</span>
                          </span>
                        </div>
                      </div>

                      {/* Middle: Timings, Route Line & Duration */}
                      <div className="md:col-span-5 px-2">
                        <div className="flex items-center justify-between text-center">
                          <div>
                            <span className="text-xl md:text-2xl font-extrabold text-foreground block tracking-tight">
                              {outbound.depTime}
                            </span>
                            <span className="text-xs font-bold text-muted-foreground font-mono">
                              {outbound.depAirport}
                            </span>
                            <span className="text-[10px] text-muted-foreground block">
                              {outbound.depDate}
                            </span>
                          </div>

                          <div className="flex-1 px-4">
                            <span className="text-xs font-semibold text-muted-foreground block mb-1">
                              {outbound.duration}
                            </span>
                            <div className="relative flex items-center justify-center">
                              <div className="w-full h-0.5 bg-slate-200 dark:bg-slate-700" />
                              <span className="absolute px-2.5 py-0.5 bg-background text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full">
                                {outbound.stops || "Direct"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-xl md:text-2xl font-extrabold text-foreground block tracking-tight">
                              {outbound.arrTime}
                            </span>
                            <span className="text-xs font-bold text-muted-foreground font-mono">
                              {outbound.arrAirport}
                            </span>
                            <span className="text-[10px] text-muted-foreground block">
                              {outbound.arrDate}
                            </span>
                          </div>
                        </div>

                        {/* Round Trip Return Preview Line */}
                        {tripType === "ROUNDTRIP" && returnLeg && (
                          <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span className="truncate">
                              Return: <strong>{returnLeg.depTime}</strong> {returnLeg.depAirport} ➔ <strong>{returnLeg.arrTime}</strong> {returnLeg.arrAirport} ({returnLeg.depDate})
                            </span>
                            <span className="font-semibold text-primary shrink-0 ml-2">
                              {returnLeg.stops} · {returnLeg.duration}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right: Price & Select/Details Button */}
                      <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0">
                        <div className="text-left md:text-right">
                          {pricing && pricing.quotable === false ? (
                            <div className="text-sm font-bold text-foreground">Contact us for this fare</div>
                          ) : pricing ? (
                            <>
                              <div className="flex items-center md:justify-end gap-1.5">
                                <span className="line-through text-xs text-muted-foreground font-medium">
                                  {pricing.formatted.regular_per_person}
                                </span>
                                <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-[10px] px-1.5 py-0 font-bold">
                                  -{pricing.discount_percent || 30}%
                                </Badge>
                              </div>
                              <div className="text-2xl font-black text-foreground tracking-tight">
                                {pricing.formatted.final_per_person}
                                <span className="text-xs font-normal text-muted-foreground">
                                  {children > 0 ? " / traveler (avg.)" : " / traveler"}
                                </span>
                              </div>
                              {totalPassengers > 1 && (
                                <div className="text-xs font-semibold text-primary">
                                  Total: {pricing.formatted.total_final} ({totalPassengers} travelers)
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-2xl font-bold text-foreground">{flight.price}</div>
                          )}
                        </div>

                        <Button
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation()
                            setDetailsModalFlight(flight)
                          }}
                          className={
                            isSelected 
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm shadow-sm" 
                              : "font-semibold border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs md:text-sm"
                          }
                        >
                          {isSelected ? (
                            <span className="flex items-center gap-1.5">
                              <Check className="h-4 w-4" />
                              Selected
                            </span>
                          ) : (
                            "View details"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Flight Details Modal (Screenshots 3 & 4) */}
      {detailsModalFlight && (() => {
        const destAirportObj = getAirportByCode(destination)
        const originAirportObj = getAirportByCode(origin)
        const destCity = destAirportObj?.city || destination
        const originCity = originAirportObj?.city || origin
        const { outbound, returnLeg } = parseFlightLegs(
          detailsModalFlight,
          origin,
          destination,
          departDate,
          returnDate,
          tripType
        )
        const pricing = detailsModalFlight.pricing

        const handleShareFlight = (e: React.MouseEvent) => {
          e.stopPropagation()
          if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href)
              .then(() => toast.success("Flight details link copied to clipboard!"))
              .catch(() => toast.info(`Flight: ${detailsModalFlight.airline} (${origin} ⇄ ${destination})`))
          }
        }

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in-50 duration-200"
            onClick={() => setDetailsModalFlight(null)}
          >
            <div 
              className="relative w-full max-w-xl md:max-w-2xl bg-background rounded-2xl shadow-2xl border border-border overflow-hidden my-auto max-h-[92vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 pb-4 border-b border-border/60 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                    Your flight to {destCity}
                  </h3>
                  <button
                    type="button"
                    onClick={handleShareFlight}
                    className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Share this flight
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailsModalFlight(null)}
                  className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  aria-label="Close flight details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1 text-foreground">
                {/* Outbound Leg */}
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="font-bold text-base text-foreground">
                      Flight to {destCity}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    {outbound.stops} · {outbound.duration}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Vertical Timeline */}
                    <div className="md:col-span-8 relative pl-6 space-y-6">
                      <div className="absolute left-[7px] top-3 bottom-3 w-[2px] bg-slate-300 dark:bg-slate-700" />

                      {/* Departure */}
                      <div className="relative">
                        <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-500 bg-background" />
                        <div className="text-xs text-muted-foreground font-medium">
                          {formatTimelineDate(outbound.depDate)} · {outbound.depTime}
                        </div>
                        <div className="text-sm font-bold text-foreground">
                          {outbound.depAirport} · {originAirportObj?.name || outbound.depAirport}
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="relative">
                        <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-500 bg-background" />
                        <div className="text-xs text-muted-foreground font-medium">
                          {formatTimelineDate(outbound.arrDate)} · {outbound.arrTime}
                        </div>
                        <div className="text-sm font-bold text-foreground">
                          {outbound.arrAirport} · {destAirportObj?.name || outbound.arrAirport}
                        </div>
                      </div>
                    </div>

                    {/* Airline Info */}
                    <div className="md:col-span-4 md:border-l md:border-border/60 md:pl-5 space-y-1">
                      <div className="flex items-center gap-2">
                        <AirlineLogo flightOrName={detailsModalFlight} size="sm" />
                        <span className="text-sm font-bold text-foreground">{detailsModalFlight.airline}</span>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {outbound.flightNumber} · {outbound.cabinClass}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Flight time {outbound.duration}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Return Leg (if Round Trip) */}
                {tripType === "ROUNDTRIP" && returnLeg && (
                  <div className="pt-4 border-t border-border/60">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="font-bold text-base text-foreground">
                        Flight to {originCity}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      {returnLeg.stops} · {returnLeg.duration}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Vertical Timeline */}
                      <div className="md:col-span-8 relative pl-6 space-y-6">
                        <div className="absolute left-[7px] top-3 bottom-3 w-[2px] bg-slate-300 dark:bg-slate-700" />

                        {/* Departure */}
                        <div className="relative">
                          <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-500 bg-background" />
                          <div className="text-xs text-muted-foreground font-medium">
                            {formatTimelineDate(returnLeg.depDate)} · {returnLeg.depTime}
                          </div>
                          <div className="text-sm font-bold text-foreground">
                            {returnLeg.depAirport} · {destAirportObj?.name || returnLeg.depAirport}
                          </div>
                        </div>

                        {/* Arrival */}
                        <div className="relative">
                          <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-500 bg-background" />
                          <div className="text-xs text-muted-foreground font-medium">
                            {formatTimelineDate(returnLeg.arrDate)} · {returnLeg.arrTime}
                          </div>
                          <div className="text-sm font-bold text-foreground">
                            {returnLeg.arrAirport} · {originAirportObj?.name || returnLeg.arrAirport}
                          </div>
                        </div>
                      </div>

                      {/* Airline Info */}
                      <div className="md:col-span-4 md:border-l md:border-border/60 md:pl-5 space-y-1">
                        <div className="flex items-center gap-2">
                          <AirlineLogo flightOrName={detailsModalFlight} size="sm" />
                          <span className="text-sm font-bold text-foreground">{detailsModalFlight.airline}</span>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {returnLeg.flightNumber} · {returnLeg.cabinClass}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Flight time {returnLeg.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-border/80" />

                {/* Baggage Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <h5 className="font-bold text-sm text-foreground">Baggage</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">The total baggage included in the price</p>
                  </div>
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <Backpack className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-foreground">1 personal item</div>
                          <div className="text-muted-foreground text-[11px]">Fits under the seat in front of you</div>
                        </div>
                      </div>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Included</span>
                    </div>

                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <Luggage className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="font-semibold text-foreground">1 carry-on bag</div>
                      </div>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Included</span>
                    </div>

                    <div className="pt-1 text-xs">
                      <span className="text-muted-foreground">Baggage policy: </span>
                      <button 
                        type="button"
                        onClick={() => toast.info(`${detailsModalFlight.airline} baggage policy: 1 personal item and 1 carry-on bag are included in this fare.`)}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                      >
                        {detailsModalFlight.airline}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 bg-muted/30 border-t border-border flex items-center justify-between gap-4">
                <div>
                  {pricing && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="line-through text-xs text-muted-foreground font-medium">
                        {pricing.formatted.regular_per_person}
                      </span>
                      <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-[10px] px-1.5 py-0 font-bold">
                        -{pricing.discount_percent || 30}%
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                      {pricing ? pricing.formatted.final_per_person : detailsModalFlight.price}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => toast.info("Fare includes all taxes, airport fees, and guaranteed GoComfortUSA discount.")}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Fare information"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tripType === "ROUNDTRIP" ? "Total price for all travelers" : "Total price for 1 traveler"}
                  </p>
                </div>

                <Button
                  type="button"
                  size="lg"
                  onClick={() => {
                    handleSelectFlight(detailsModalFlight)
                    setDetailsModalFlight(null)
                    toast.success(`Selected ${detailsModalFlight.airline} flight! Please enter traveler details below.`)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-md text-sm md:text-base cursor-pointer transition-all active:scale-[0.98]"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Passenger Details & Booking Confirmation Section */}
      {selectedFlight && (
        <Card id="passenger-details-section" className="border-primary/40 shadow-xl bg-white dark:bg-slate-900 scroll-mt-24">
          <CardHeader className="bg-muted/40 border-b border-border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Traveler & Government ID Verification
                </CardTitle>
                <CardDescription>
                  Airlines require passenger names and dates of birth to strictly match valid government ID or Passport.
                </CardDescription>
              </div>

              {/* Selected Flight Summary Chip */}
              <div className="p-3 bg-background border border-border rounded-xl flex items-center gap-4 text-xs">
                <AirlineLogo flightOrName={selectedFlight} size="md" />
                <div>
                  <span className="font-bold text-foreground block">{selectedFlight.airline}</span>
                  <span className="text-muted-foreground">{selectedFlight.departure_time} - {selectedFlight.arrival_time}</span>
                  {tripType === "ROUNDTRIP" ? (
                    <span className="text-[11px] text-primary font-semibold block mt-0.5">
                      Round Trip: {origin} ⇄ {destination} (Return: {returnDate})
                    </span>
                  ) : (
                    <span className="text-[11px] text-primary font-semibold block mt-0.5">
                      One Way: {origin} → {destination} ({departDate})
                    </span>
                  )}
                </div>
                <div className="h-10 w-px bg-border" />
                <div className="text-right">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">APPROX. 30% DISCOUNT</span>
                  <span className="text-base font-extrabold text-foreground">
                    ~{selectedFlight.pricing?.formatted.total_final || selectedFlight.price}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmitInquiry} className="space-y-6">
              {/* Primary Contact Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-primary" />
                  Primary Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contactFirstName" className="text-xs font-semibold">Contact First Name *</Label>
                    <Input
                      id="contactFirstName"
                      required
                      value={contactFirstName}
                      onChange={(e) => setContactFirstName(e.target.value)}
                      placeholder="e.g. John"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contactLastName" className="text-xs font-semibold">Contact Last Name *</Label>
                    <Input
                      id="contactLastName"
                      required
                      value={contactLastName}
                      onChange={(e) => setContactLastName(e.target.value)}
                      placeholder="e.g. Doe"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phoneNumber" className="text-xs font-semibold">WhatsApp / Phone *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold">Email Address (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Individual Passengers Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    Traveler Identification ({passengersList.length} passenger{passengersList.length > 1 ? "s" : ""})
                  </h4>
                  <span className="text-xs text-muted-foreground">ID Verification Required for E-Tickets</span>
                </div>

                <div className="space-y-3">
                  {passengersList.map((passenger, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>Traveler #{idx + 1} ({passenger.passengerType})</span>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {passenger.passengerType === "CHILD"
                            ? `Child (age ${childAges[idx - adults] ?? "?"})`
                            : "Adult (18+)"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Full Legal Name (as per Valid ID) *</Label>
                          <Input
                            required
                            value={passenger.fullNameAsPerId}
                            onChange={(e) => handlePassengerNameChange(idx, e.target.value)}
                            placeholder="First Middle Last"
                            className="bg-white dark:bg-slate-950"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Date of Birth (MM/DD/YYYY) *</Label>
                          <Input
                            required
                            maxLength={10}
                            value={passenger.dob}
                            onChange={(e) => handleDobChange(idx, e.target.value)}
                            placeholder="MM/DD/YYYY"
                            className="bg-white dark:bg-slate-950 font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Gender *</Label>
                          <select
                            value={passenger.gender}
                            onChange={(e) => handleGenderChange(idx, e.target.value as any)}
                            className="flex h-10 w-full rounded-md border border-input bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Notes / Requests */}
              <div className="space-y-1.5">
                <Label htmlFor="customerNotes" className="text-xs font-semibold">Special Requests / Seating Notes (Optional)</Label>
                <textarea
                  id="customerNotes"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g., Aisle seat preferred, dietary meal request, wheelchair assistance..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Error Callout */}
              {formError && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 flex items-center gap-2 text-sm text-red-700 dark:text-red-400 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Success Callout */}
              {inquirySuccess && (
                <div id="confirmation-section" className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl font-bold text-emerald-950 dark:text-emerald-200">
                    Quote Request Received!
                  </h4>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">
                    Quote Reference Number: <strong className="font-mono font-bold text-base px-2 py-0.5 bg-emerald-200/60 dark:bg-emerald-900 rounded">{inquirySuccess.inquiryNumber}</strong>
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-lg mx-auto">
                    Your discounted fare for this itinerary is approx <strong>~{selectedFlight.pricing?.formatted.total_final || selectedFlight.price}</strong>. Our travel specialist has received your traveler ID verification and will message you at <strong>{phoneNumber}</strong> with your <strong>exact discounted quote</strong> and ticket within 15–30 minutes.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetSearch}
                    className="mt-3 text-xs font-semibold"
                  >
                    Book Another Flight
                  </Button>
                </div>
              )}

              {/* Approximate Price & Exact Quote Callout */}
              {!inquirySuccess && (
                <div className="p-4 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                        <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        Approx. 30% Discount
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">Market Estimate</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Your discounted fare is approx <strong className="text-emerald-700 dark:text-emerald-400 text-base font-black">~{selectedFlight.pricing?.formatted.total_final || selectedFlight.price}</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submit traveler details below to get a formal quote for your exact discounted price.
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[11px] text-muted-foreground block font-medium">Estimated Total</span>
                    <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 block tracking-tight">
                      ~{selectedFlight.pricing?.formatted.total_final || selectedFlight.price}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      ({selectedFlight.pricing?.formatted.final_per_person || selectedFlight.price} / person)
                    </span>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              {!inquirySuccess && (
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-6 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Requesting Quote for Exact Discounted Price...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      Get Quote for Exact Discounted Price (~{selectedFlight.pricing?.formatted.total_final || selectedFlight.price})
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
