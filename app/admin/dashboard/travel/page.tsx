"use client";

import { useEffect, useState } from "react";
import { 
  Plane, 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  RefreshCw, 
  Eye, 
  ArrowRight,
  Luggage,
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Passenger {
  id: string;
  passengerIndex: number;
  passengerType: string;
  childAge?: number | null;
  fullNameAsPerId: string;
  dob: string;
  gender: string;
}

interface FlightInquiry {
  id: string;
  inquiryNumber: string;
  contactFirstName: string;
  contactLastName: string;
  phoneNumber: string;
  email?: string | null;
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string | null;
  tripType: string;
  cabinClass: string;
  adults: number;
  children: number;
  totalPassengers: number;
  quoteId?: string | null;
  selectedAirline: string;
  flightNumber?: string | null;
  departureTime?: string | null;
  arrivalTime?: string | null;
  duration?: string | null;
  stops: string;
  baggage?: string | null;
  returnAirline?: string | null;
  returnFlightNumber?: string | null;
  returnDepartureTime?: string | null;
  returnArrivalTime?: string | null;
  returnOrigin?: string | null;
  returnDestination?: string | null;
  returnDuration?: string | null;
  returnStops?: string | null;
  flightData?: string | null;
  scrapedBaseFare: number;
  regularMarketFare: number;
  discountPercent: number;
  finalFarePerPerson: number;
  totalPrice: number;
  currency: string;
  status: string;
  customerNotes?: string | null;
  adminNotes?: string | null;
  passengers: Passenger[];
  createdAt: string;
}

export default function AdminTravelInquiriesPage() {
  const [inquiries, setInquiries] = useState<FlightInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInquiry, setSelectedInquiry] = useState<FlightInquiry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [adminNoteInput, setAdminNoteInput] = useState("");

  const fetchInquiries = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (search.trim()) params.append("search", search.trim());
      params.append("_t", Date.now().toString());

      const res = await fetch(`/api/admin/flights/inquiries?${params.toString()}`, {
        cache: "no-store",
        headers: {
          "Pragma": "no-cache",
          "Cache-Control": "no-cache",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries(true);

    // Auto-refresh every 8 seconds so newly submitted flight quotes appear automatically without manual reloads
    const interval = setInterval(() => {
      fetchInquiries(false);
    }, 8000);

    return () => clearInterval(interval);
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiries(true);
  };

  const handleOpenDetail = (inquiry: FlightInquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNoteInput(inquiry.adminNotes || "");
    setDialogOpen(true);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedInquiry) return;
    try {
      setUpdatingStatus(true);
      const res = await fetch("/api/admin/flights/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedInquiry.id,
          status: newStatus,
          adminNotes: adminNoteInput.trim() || null,
        }),
      });
      if (res.ok) {
        const { inquiry } = await res.json();
        setSelectedInquiry(inquiry);
        setInquiries((prev) => prev.map((item) => (item.id === inquiry.id ? inquiry : item)));
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Metrics
  const totalInquiries = inquiries.length;
  const pendingCount = inquiries.filter((i) => i.status === "PENDING").length;
  const confirmedCount = inquiries.filter((i) => i.status === "CONFIRMED").length;
  const totalBookedValue = inquiries
    .filter((i) => i.status !== "CANCELLED")
    .reduce((sum, i) => sum + (i.totalPrice || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Pending</Badge>;
      case "CONFIRMED":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Confirmed</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Flight Customer Inquiries
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time customer bookings, ID documents, traveler details, and 30% discount quote reconciliations.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Auto-refresh (8s)
          </span>
          <Button 
            variant="outline" 
            onClick={() => fetchInquiries(true)} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Inquiries
            </CardTitle>
            <Plane className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInquiries}</div>
            <p className="text-xs text-muted-foreground mt-1">Customer quotes submitted</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Pending Action
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Needs customer call / booking</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Confirmed
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{confirmedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready or ticketed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Pipeline Value
            </CardTitle>
            <DollarSign className="h-5 w-5 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBookedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">Customer booking revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="text-xs font-semibold"
              >
                {status}
              </Button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search reference, name, phone, route..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
            <Button type="submit" size="sm" variant="secondary" className="h-9 text-xs">
              Search
            </Button>
          </form>
        </div>
      </Card>

      {/* Inquiries Table / List */}
      <Card className="shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b">
              <tr>
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Customer Contact</th>
                <th className="py-3 px-4">Flight Route</th>
                <th className="py-3 px-4">Travel Date</th>
                <th className="py-3 px-4">Travelers</th>
                <th className="py-3 px-4">Customer Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading flight customer inquiries...
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <Plane className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    No flight inquiries found.
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-primary">
                      {inquiry.inquiryNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">
                        {inquiry.contactFirstName} {inquiry.contactLastName}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <a href={`tel:${inquiry.phoneNumber}`} className="hover:underline">
                          {inquiry.phoneNumber}
                        </a>
                      </div>
                      {inquiry.email && (
                        <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="truncate max-w-[180px]">{inquiry.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900 text-xs">
                        <span>{inquiry.origin}</span>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span>{inquiry.destination}</span>
                        <Badge variant="outline" className={`text-[10px] py-0 px-1.5 font-semibold ${inquiry.tripType === "ROUNDTRIP" ? "border-blue-400 text-blue-700 bg-blue-50" : "border-gray-300 text-gray-600 bg-gray-50"}`}>
                          {inquiry.tripType === "ROUNDTRIP" ? "Round Trip" : "One Way"}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {inquiry.selectedAirline} {inquiry.flightNumber ? `· ${inquiry.flightNumber}` : ""}
                      </div>
                      {inquiry.tripType === "ROUNDTRIP" && (
                        <div className="text-[10px] text-blue-600 font-medium mt-0.5 flex items-center gap-1">
                          <RotateCcw className="h-2.5 w-2.5" />
                          <span>Ret: {inquiry.returnOrigin || inquiry.destination} ➔ {inquiry.returnDestination || inquiry.origin} ({inquiry.returnFlightNumber || "Flight"})</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {inquiry.departDate}
                      </div>
                      {inquiry.tripType === "ROUNDTRIP" && inquiry.returnDate && (
                        <div className="text-[11px] text-blue-600 mt-0.5 font-medium flex items-center gap-1">
                          <RotateCcw className="h-2.5 w-2.5" />
                          Ret: {inquiry.returnDate}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-xs font-semibold text-gray-800">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        <span>{inquiry.totalPassengers} Pax</span>
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {inquiry.adults} Adult{inquiry.adults > 1 ? "s" : ""}
                        {inquiry.children > 0 ? `, ${inquiry.children} Child` : ""}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-sm font-extrabold text-emerald-600">
                        ${inquiry.totalPrice?.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-gray-400 line-through">
                        ${inquiry.regularMarketFare?.toFixed(2)} reg
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(inquiry.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDetail(inquiry)}
                        className="h-8 text-xs font-medium"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail & ID Information Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedInquiry && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <span>Inquiry Reference: {selectedInquiry.inquiryNumber}</span>
                  </DialogTitle>
                  <div>{getStatusBadge(selectedInquiry.status)}</div>
                </div>
                <DialogDescription>
                  Submitted on {new Date(selectedInquiry.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                {/* Contact Card */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Primary Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs">Full Name:</span>
                      <p className="font-semibold text-gray-900">
                        {selectedInquiry.contactFirstName} {selectedInquiry.contactLastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Phone Number:</span>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        {selectedInquiry.phoneNumber}
                        <a 
                          href={`https://wa.me/${selectedInquiry.phoneNumber.replace(/[^0-9]/g, "")}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-medium hover:bg-emerald-700"
                        >
                          WhatsApp
                        </a>
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Email Address:</span>
                      <p className="font-semibold text-gray-900">{selectedInquiry.email || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Cabin & Trip Type:</span>
                      <p className="font-semibold text-gray-900">
                        {selectedInquiry.cabinClass} · {selectedInquiry.tripType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Flight & Pricing Summary */}
                <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Selected Flight Itinerary ({selectedInquiry.tripType === "ROUNDTRIP" ? "Round Trip" : "One Way"})
                    </h3>
                    <Badge className={selectedInquiry.tripType === "ROUNDTRIP" ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"}>
                      {selectedInquiry.tripType === "ROUNDTRIP" ? "Round Trip (2 Legs)" : "One Way"}
                    </Badge>
                  </div>

                  {/* Outbound Leg */}
                  <div className="bg-white p-3 rounded-md border border-gray-200 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                        <Plane className="h-3.5 w-3.5" />
                        Outbound Flight ({selectedInquiry.origin} ➔ {selectedInquiry.destination})
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {selectedInquiry.departDate}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Airline & Flight #:</span>
                        <span className="font-semibold text-gray-900">{selectedInquiry.selectedAirline} · {selectedInquiry.flightNumber || "Flight Option"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Flight Times:</span>
                        <span className="font-semibold text-gray-900">{selectedInquiry.departureTime || "TBD"} ➔ {selectedInquiry.arrivalTime || "TBD"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Duration & Stops:</span>
                        <span className="font-semibold text-gray-900">{selectedInquiry.duration || "Direct"} · {selectedInquiry.stops}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Baggage:</span>
                        <span className="font-semibold text-emerald-700">{selectedInquiry.baggage || "1 personal item included"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Return Leg (if round trip) */}
                  {selectedInquiry.tripType === "ROUNDTRIP" && (
                    <div className="bg-white p-3 rounded-md border border-blue-200 bg-blue-50/20 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                          <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
                          Return Flight ({selectedInquiry.returnOrigin || selectedInquiry.destination} ➔ {selectedInquiry.returnDestination || selectedInquiry.origin})
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          {selectedInquiry.returnDate || "Return Date"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400 block text-[10px]">Airline & Flight #:</span>
                          <span className="font-semibold text-gray-900">{selectedInquiry.returnAirline || selectedInquiry.selectedAirline} · {selectedInquiry.returnFlightNumber || "Return Flight"}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px]">Flight Times:</span>
                          <span className="font-semibold text-gray-900">{selectedInquiry.returnDepartureTime || "12:00 PM"} ➔ {selectedInquiry.returnArrivalTime || "3:00 PM"}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px]">Duration & Stops:</span>
                          <span className="font-semibold text-gray-900">{selectedInquiry.returnDuration || selectedInquiry.duration || "N/A"} · {selectedInquiry.returnStops || "Direct"}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px]">Baggage:</span>
                          <span className="font-semibold text-emerald-700">{selectedInquiry.baggage || "1 personal item included"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="pt-2 border-t grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500 block">Published Scraped vs Regular Market Fare:</span>
                      <p className="font-medium text-gray-800">
                        Scraped Base: ${selectedInquiry.scrapedBaseFare?.toFixed(2)} · Regular: ${selectedInquiry.regularMarketFare?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Customer Total (30% Discount Applied):</span>
                      <p className="text-base font-extrabold text-emerald-600">
                        ${selectedInquiry.totalPrice?.toFixed(2)} <span className="text-xs text-gray-500 font-normal">(${selectedInquiry.finalFarePerPerson?.toFixed(2)}/traveler)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Passenger Government ID & DOB List */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Traveler Information (As Per Government Valid ID)</span>
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 text-gray-600 font-semibold border-b">
                        <tr>
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">Full Name (Per ID)</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">DOB (MM/DD/YYYY)</th>
                          <th className="py-2.5 px-3">Gender</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedInquiry.passengers?.map((p, idx) => (
                          <tr key={p.id || idx} className="hover:bg-gray-50">
                            <td className="py-2.5 px-3 font-semibold text-gray-500">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-bold text-gray-900">{p.fullNameAsPerId}</td>
                            <td className="py-2.5 px-3">
                              <Badge variant="outline" className="text-[10px]">
                                {p.passengerType} {p.childAge !== null && p.childAge !== undefined ? `(${p.childAge} yrs)` : ""}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 font-mono">{p.dob}</td>
                            <td className="py-2.5 px-3 capitalize">{p.gender}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Customer Notes */}
                {selectedInquiry.customerNotes && (
                  <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-200">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Customer Notes:
                    </span>
                    <p className="text-xs text-blue-800 mt-1">{selectedInquiry.customerNotes}</p>
                  </div>
                )}

                {/* Admin Status & Notes Actions */}
                <div className="space-y-3 pt-2 border-t">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Admin Internal Notes:
                    </label>
                    <textarea
                      rows={2}
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      placeholder="Add internal notes about ticket confirmation, payment received, airline PNR reference..."
                      className="w-full text-xs p-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <span className="text-xs font-bold text-gray-600">Change Inquiry Status:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant={selectedInquiry.status === "PENDING" ? "default" : "outline"}
                        disabled={updatingStatus}
                        onClick={() => handleUpdateStatus("PENDING")}
                        className="text-xs h-8"
                      >
                        Pending
                      </Button>
                      <Button
                        size="sm"
                        disabled={updatingStatus}
                        onClick={() => handleUpdateStatus("CONFIRMED")}
                        className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Confirm Booking
                      </Button>
                      <Button
                        size="sm"
                        disabled={updatingStatus}
                        onClick={() => handleUpdateStatus("COMPLETED")}
                        className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Mark Completed
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={updatingStatus}
                        onClick={() => handleUpdateStatus("CANCELLED")}
                        className="text-xs h-8"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
