"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Hotel,
  MapPin,
  Calendar,
  Users,
  Search,
  Star,
  Check,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  Wifi,
  Coffee,
  Waves,
  Car,
  Dog,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface HotelResult {
  id: string;
  name: string;
  location: string;
  description: string;
  score: number;
  ratingLabel: string;
  reviewCount: number;
  stars: number;
  imageUrl: string;
  amenities: string[];
  retailPrice: number;
  quotePrice: number;
  savings: number;
  discountPercent: number;
  bookingUrl: string;
  currency: string;
}

const POPULAR_DESTINATIONS = [
  { name: "Miami Beach", label: "Miami Beach, FL" },
  { name: "Orlando", label: "Orlando, FL (Disney World)" },
  { name: "Las Vegas", label: "Las Vegas, NV (The Strip)" },
  { name: "New York", label: "New York City, NY" },
  { name: "Los Angeles", label: "Los Angeles, CA" },
  { name: "Hawaii", label: "Honolulu & Maui, HI" },
];

export default function HotelBookingPage() {
  // Search inputs
  const [destination, setDestination] = useState("Miami Beach");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [rooms, setRooms] = useState("1");

  // Search state
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [numberOfNights, setNumberOfNights] = useState(3);

  // Quote modal
  const [selectedHotel, setSelectedHotel] = useState<HotelResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [confirmedInquiryNumber, setConfirmedInquiryNumber] = useState<string | null>(null);

  // Guest form fields
  const [guestName, setGuestName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [roomType, setRoomType] = useState("Standard King / Double Room");
  const [specialRequests, setSpecialRequests] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Initialize default dates (7 days from now, 3 night stay)
  useEffect(() => {
    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(today.getDate() + 7);
    const d2 = new Date(d1);
    d2.setDate(d1.getDate() + 3);

    const formatYMD = (d: Date) => d.toISOString().split("T")[0];
    setCheckInDate(formatYMD(d1));
    setCheckOutDate(formatYMD(d2));
    setNumberOfNights(3);
  }, []);

  // Recalculate nights when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setNumberOfNights(diffDays);
    }
  }, [checkInDate, checkOutDate]);

  // Execute hotel search
  const handleSearch = async (overrideDest?: string) => {
    const targetDest = overrideDest || destination;
    if (!targetDest.trim()) {
      toast.error("Please enter a destination city or resort area.");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams({
        destination: targetDest,
        checkin: checkInDate,
        checkout: checkOutDate,
        adults: adults,
        rooms: rooms,
      });

      const res = await fetch(`/api/hotels/search?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.hotels)) {
        setHotels(data.hotels);
        if (overrideDest) setDestination(overrideDest);
      } else {
        toast.error(data.error || "No hotels found. Please try another destination.");
      }
    } catch (err) {
      console.error("Hotel search error:", err);
      toast.error("Failed to connect to Booking.com hotel search.");
    } finally {
      setLoading(false);
    }
  };

  // Run initial search on mount
  useEffect(() => {
    handleSearch("Miami Beach");
  }, []);

  // Open booking modal
  const handleOpenBooking = (hotel: HotelResult) => {
    setSelectedHotel(hotel);
    setConfirmedInquiryNumber(null);
    setModalOpen(true);
  };

  // Submit quote request
  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) return;

    if (!guestName.trim()) {
      toast.error("Please provide your full legal name.");
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error("Please enter a valid phone or WhatsApp number with at least 10 digits.");
      return;
    }

    setSubmittingQuote(true);
    try {
      const payload = {
        customerName: guestName,
        phoneNumber,
        email,
        hotelName: selectedHotel.name,
        hotelUrl: selectedHotel.bookingUrl,
        imageUrl: selectedHotel.imageUrl,
        location: selectedHotel.location,
        checkInDate,
        checkOutDate,
        numberOfNights,
        numberOfRooms: parseInt(rooms, 10) || 1,
        numberOfAdults: parseInt(adults, 10) || 2,
        numberOfChildren: parseInt(children, 10) || 0,
        roomType,
        retailPrice: selectedHotel.retailPrice,
        discountPercent: selectedHotel.discountPercent,
        quotePrice: selectedHotel.quotePrice,
        specialRequests,
      };

      const res = await fetch("/api/hotels/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfirmedInquiryNumber(data.inquiryNumber);
        toast.success("Hotel reservation inquiry confirmed!");
      } else {
        toast.error(data.error || "Failed to submit quote inquiry. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred while submitting.");
    } finally {
      setSubmittingQuote(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Best Rate Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Accommodations</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Luxury Stays &amp; Hotels at <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">30% Less</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl">
            Live real-time rates from top Booking.com resorts, boutique hotels, and beachfront retreats with our exclusive GoComfortUSA member discount.
          </p>

          {/* Quick Destination Chips */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Popular:</span>
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                onClick={() => handleSearch(dest.name)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  destination.toLowerCase().includes(dest.name.toLowerCase())
                    ? "bg-emerald-500 text-white shadow-xs font-bold"
                    : "bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
                }`}
              >
                {dest.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky / Floating Search Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <Card className="shadow-xl border-border bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-4 sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end"
          >
            {/* Destination */}
            <div className="lg:col-span-4 space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>Destination or Hotel</span>
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g. Miami, Orlando, Las Vegas, New York..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="font-semibold text-sm pl-9"
                  required
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Check-in Date */}
            <div className="lg:col-span-2 space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Check-in</span>
              </Label>
              <Input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="font-medium text-xs"
                required
              />
            </div>

            {/* Check-out Date */}
            <div className="lg:col-span-2 space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Check-out</span>
              </Label>
              <Input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="font-medium text-xs"
                required
              />
            </div>

            {/* Guests & Rooms */}
            <div className="lg:col-span-2 space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>Guests &amp; Rooms</span>
              </Label>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="h-9 px-2 text-xs font-medium rounded-md border border-input bg-background"
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                  <option value="5">5+ Adults</option>
                </select>
                <select
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  className="h-9 px-2 text-xs font-medium rounded-md border border-input bg-background"
                >
                  <option value="1">1 Room</option>
                  <option value="2">2 Rooms</option>
                  <option value="3">3 Rooms</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 cursor-pointer shadow-md"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Main Results Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Hotels in {destination}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Showing {hotels.length} verified Booking.com properties for {numberOfNights} night{numberOfNights > 1 ? "s" : ""}, {adults} guest{parseInt(adults, 10) > 1 ? "s" : ""}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <Percent className="w-3.5 h-3.5" />
            <span>30% Member Discount Applied</span>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-800" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && hasSearched && hotels.length === 0 && (
          <Card className="p-12 text-center max-w-lg mx-auto">
            <Hotel className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground">No Hotels Found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Try searching for popular destinations like Miami, Orlando, Las Vegas, New York, or Hawaii.
            </p>
            <Button onClick={() => handleSearch("Miami Beach")}>Search Miami Beach</Button>
          </Card>
        )}

        {/* Hotel Grid */}
        {!loading && hotels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <Card
                key={hotel.id}
                className="overflow-hidden border-border hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col group bg-card"
              >
                {/* Image Container with Badges */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* 30% OFF Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md border-0">
                      30% OFF
                    </Badge>
                  </div>

                  {/* Review Score Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{hotel.score.toFixed(1)}</span>
                      <span className="text-slate-300 font-normal">({hotel.ratingLabel})</span>
                    </div>

                    <span className="text-[11px] text-slate-200">
                      {hotel.reviewCount.toLocaleString()} reviews
                    </span>
                  </div>
                </div>

                {/* Hotel Details */}
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">
                      {hotel.name}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{hotel.location}</span>
                    </div>

                    <p className="text-xs text-muted-foreground/90 mt-2.5 line-clamp-2 leading-relaxed">
                      {hotel.description}
                    </p>

                    {/* Amenities Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Breakdown & Booking Button */}
                  <div className="pt-3 border-t border-border mt-auto">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-[11px] text-muted-foreground block">
                          Total for {numberOfNights} night{numberOfNights > 1 ? "s" : ""}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            ${hotel.quotePrice.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            ${hotel.retailPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                          Save ${hotel.savings.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleOpenBooking(hotel)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 cursor-pointer shadow-md"
                    >
                      <span>Book with 30% Discount</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Booking / Quote Modal */}
      {selectedHotel && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            {!confirmedInquiryNumber ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Hotel className="w-5 h-5 text-blue-600" />
                    <span>Reserve with 30% Discount</span>
                  </DialogTitle>
                  <DialogDescription>
                    Lock in exclusive GoComfortUSA member pricing for your stay.
                  </DialogDescription>
                </DialogHeader>

                {/* Hotel Summary Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border flex items-center gap-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                    <Image
                      src={selectedHotel.imageUrl}
                      alt={selectedHotel.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-foreground truncate">
                      {selectedHotel.name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">{selectedHotel.location}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-base font-black text-emerald-600">
                        ${selectedHotel.quotePrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        ${selectedHotel.retailPrice.toFixed(2)}
                      </span>
                      <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0">
                        Save ${selectedHotel.savings.toFixed(2)} (30% OFF)
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stay Summary */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Check-in:</span>
                    <strong className="text-foreground">{checkInDate}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Check-out:</span>
                    <strong className="text-foreground">{checkOutDate}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Stay Duration:</span>
                    <strong className="text-foreground">{numberOfNights} Nights ({adults} Guests)</strong>
                  </div>
                </div>

                {/* Reservation Form */}
                <form onSubmit={handleSubmitQuote} className="space-y-4 mt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">
                      Lead Guest Full Name (as per Photo ID) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g. Johnathan Miller"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">
                        Phone / WhatsApp <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="tel"
                        placeholder="e.g. +1 (305) 555-0199"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Email Address</Label>
                      <Input
                        type="email"
                        placeholder="e.g. guest@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Room Type Preference</Label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full h-9 px-3 text-xs rounded-md border border-input bg-background"
                    >
                      <option value="Standard King / Double Room">Standard King / Double Room</option>
                      <option value="Deluxe Ocean View / City View">Deluxe Ocean View / City View</option>
                      <option value="Executive Suite with Balcony">Executive Suite with Balcony</option>
                      <option value="Two-Bedroom Family Suite">Two-Bedroom Family Suite</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Special Requests or Accessibility Needs</Label>
                    <Input
                      type="text"
                      placeholder="e.g. High floor, early check-in, quiet room, crib..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 cursor-pointer"
                      required
                    />
                    <label htmlFor="terms" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                      I agree to the GoComfortUSA travel reservation terms and authorize an agent to contact me via phone/WhatsApp with confirmation.
                    </label>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setModalOpen(false)}
                      disabled={submittingQuote}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submittingQuote || !termsAccepted}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 cursor-pointer"
                    >
                      {submittingQuote ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Confirm Quote Reservation</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              /* Success Confirmation Screen */
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-foreground">
                    Hotel Reservation Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                    Your exclusive 30% discount quote has been locked in. A GoComfortUSA travel specialist will reach out shortly to finalize your stay.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border inline-block text-left w-full max-w-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Your Tracking Reference
                  </span>
                  <div className="text-xl font-black text-blue-600 font-mono tracking-wide">
                    {confirmedInquiryNumber}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <p><strong>Hotel:</strong> {selectedHotel.name}</p>
                    <p><strong>Stay:</strong> {checkInDate} to {checkOutDate} ({numberOfNights} Nights)</p>
                    <p><strong>Total (30% OFF):</strong> ${selectedHotel.quotePrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => {
                      setModalOpen(false);
                      setConfirmedInquiryNumber(null);
                    }}
                    className="w-full max-w-xs"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
