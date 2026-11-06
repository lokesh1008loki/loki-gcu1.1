"use client";

import Link from "next/link";
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
  MessageSquare,
  RotateCcw,
  Trash2,
  Undo2,
  History,
  Edit3,
  ShieldCheck,
  FileText,
  AlertTriangle
} from "lucide-react";
import { getAirlineLogo } from "@/components/FlightBookingFlow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Passenger {
  id: string;
  passengerIndex: number;
  passengerType: string;
  childAge?: number | null;
  fullNameAsPerId: string;
  dob: string;
  gender: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: "CREATE" | "EDIT" | "SOFT_DELETE" | "RESTORE";
  author: string;
  details?: string;
  changes?: Array<{ field: string; from: any; to: any }>;
  reason?: string;
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
  const [deletedCount, setDeletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInquiry, setSelectedInquiry] = useState<FlightInquiry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "edit" | "logs">("details");

  // Edit form state
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDepartDate, setEditDepartDate] = useState("");
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [editReason, setEditReason] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Soft Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<FlightInquiry | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
        if (typeof data.deletedCount === "number") {
          setDeletedCount(data.deletedCount);
        }
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries(true);

    const interval = setInterval(() => {
      fetchInquiries(false);
    }, 8000);

    return () => clearInterval(interval);
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiries(true);
  };

  const handleOpenDetail = (inquiry: FlightInquiry, defaultTab: "details" | "edit" | "logs" = "details") => {
    setSelectedInquiry(inquiry);
    setAdminNoteInput(inquiry.adminNotes || "");
    setEditFirstName(inquiry.contactFirstName || "");
    setEditLastName(inquiry.contactLastName || "");
    setEditPhone(inquiry.phoneNumber || "");
    setEditEmail(inquiry.email || "");
    setEditDepartDate(inquiry.departDate || "");
    setEditReason("");
    setActiveTab(defaultTab);
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
          editReason: `Status changed to ${newStatus}`,
        }),
      });
      if (res.ok) {
        const { inquiry } = await res.json();
        setSelectedInquiry(inquiry);
        setInquiries((prev) => prev.map((item) => (item.id === inquiry.id ? inquiry : item)));
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    try {
      setIsSavingEdit(true);
      const res = await fetch("/api/admin/flights/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedInquiry.id,
          contactFirstName: editFirstName.trim(),
          contactLastName: editLastName.trim(),
          phoneNumber: editPhone.trim(),
          email: editEmail.trim() || null,
          departDate: editDepartDate.trim(),
          adminNotes: adminNoteInput.trim() || null,
          editReason: editReason.trim() || "Admin modified passenger/contact info",
        }),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      const { inquiry } = await res.json();
      setSelectedInquiry(inquiry);
      setInquiries((prev) => prev.map((item) => (item.id === inquiry.id ? inquiry : item)));
      toast.success("Changes saved and audit log created!");
      setActiveTab("details");
    } catch (err: any) {
      toast.error(err.message || "Failed to save edits");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const promptSoftDelete = (inquiry: FlightInquiry) => {
    setInquiryToDelete(inquiry);
    setDeleteReason("");
    setDeleteDialogOpen(true);
  };

  const confirmSoftDelete = async () => {
    if (!inquiryToDelete) return;

    try {
      setIsDeleting(true);
      const res = await fetch("/api/admin/flights/inquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: inquiryToDelete.id,
          reason: deleteReason.trim() || "Removed from dashboard by admin",
        }),
      });

      if (!res.ok) throw new Error("Failed to delete inquiry");

      toast.success(`Inquiry ${inquiryToDelete.inquiryNumber} soft-deleted. Saved in database.`);
      setDeleteDialogOpen(false);
      setInquiryToDelete(null);

      // Refresh list
      fetchInquiries(false);
    } catch (err: any) {
      toast.error(err.message || "Error soft-deleting inquiry");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async (inquiry: FlightInquiry) => {
    try {
      const res = await fetch("/api/admin/flights/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: inquiry.id,
          action: "RESTORE",
        }),
      });

      if (!res.ok) throw new Error("Failed to restore inquiry");
      toast.success(`Inquiry ${inquiry.inquiryNumber} restored to active!`);
      fetchInquiries(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to restore inquiry");
    }
  };

  // Helper to extract audit logs from flightData JSON
  const getAuditLogs = (inquiry: FlightInquiry | null): AuditLogEntry[] => {
    if (!inquiry?.flightData) return [];
    try {
      const parsed = typeof inquiry.flightData === "string" ? JSON.parse(inquiry.flightData) : inquiry.flightData;
      return Array.isArray(parsed?.auditLogs) ? parsed.auditLogs : [];
    } catch {
      return [];
    }
  };

  // Metrics
  const totalInquiries = inquiries.length;
  const pendingCount = inquiries.filter((i) => i.status === "PENDING").length;
  const confirmedCount = inquiries.filter((i) => i.status === "CONFIRMED").length;
  const totalBookedValue = inquiries
    .filter((i) => i.status !== "CANCELLED" && i.status !== "DELETED")
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
      case "DELETED":
        return <Badge className="bg-red-950 text-red-200 border-red-800">Soft Deleted</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const auditLogs = getAuditLogs(selectedInquiry);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Plane className="h-8 w-8 text-primary" />
            Flight Customer Inquiries
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time customer bookings, traveler ID records, audit logs, and soft-delete management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5 inline-block" />
            Auto-refresh (8s)
          </Badge>

          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard/ikea">
              <span className="mr-1">🛋️</span> View IKEA Orders
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard/hotels">
              <span className="mr-1">🏨</span> View Hotel Bookings
            </Link>
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchInquiries(true)}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Active Inquiries
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
            <div className="text-2xl font-bold">
              ${totalBookedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Customer booking revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar with Trash Tab */}
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

            {/* Trash Tab (Soft Deleted Inquiries) */}
            <Button
              variant={statusFilter === "DELETED" ? "destructive" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("DELETED")}
              className={`text-xs font-semibold flex items-center gap-1.5 ${
                statusFilter === "DELETED" 
                  ? "bg-red-600 text-white" 
                  : "text-red-600 border-red-200 hover:bg-red-50"
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Trash (Soft-Deleted)</span>
              {deletedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                  {deletedCount}
                </span>
              )}
            </Button>
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

      {/* Inquiries Table */}
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
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading flight inquiries...
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <Plane className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    {statusFilter === "DELETED" 
                      ? "Trash is empty. No soft-deleted flight inquiries." 
                      : "No flight inquiries found."}
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
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {inquiry.status === "DELETED" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDetail(inquiry, "logs")}
                            className="h-8 text-xs font-medium"
                          >
                            <History className="h-3.5 w-3.5 mr-1" />
                            View Logs
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestore(inquiry)}
                            className="h-8 text-xs font-medium text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                          >
                            <Undo2 className="h-3.5 w-3.5 mr-1" />
                            Restore
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDetail(inquiry, "details")}
                            className="h-8 text-xs font-medium"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDetail(inquiry, "edit")}
                            className="h-8 text-xs font-medium"
                          >
                            <Edit3 className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => promptSoftDelete(inquiry)}
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Soft delete from dashboard"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Dialog for Soft Delete */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Soft Delete Flight Inquiry
            </DialogTitle>
            <DialogDescription>
              This inquiry will be removed from your active dashboard view, but will remain safely archived in the database with a complete audit record.
            </DialogDescription>
          </DialogHeader>

          {inquiryToDelete && (
            <div className="space-y-3 py-2 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg border text-xs space-y-1">
                <p><strong>Reference:</strong> <span className="font-mono text-primary font-bold">{inquiryToDelete.inquiryNumber}</span></p>
                <p><strong>Customer:</strong> {inquiryToDelete.contactFirstName} {inquiryToDelete.contactLastName} ({inquiryToDelete.phoneNumber})</p>
                <p><strong>Route:</strong> {inquiryToDelete.origin} ➔ {inquiryToDelete.destination} ({inquiryToDelete.departDate})</p>
                <p><strong>Amount:</strong> ${inquiryToDelete.totalPrice?.toFixed(2)} USD</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="delReason" className="text-xs font-medium text-slate-700">
                  Reason for Deletion (Logged for Audit Trail):
                </Label>
                <Input
                  id="delReason"
                  placeholder="e.g. Duplicate entry, Cancelled by client, Test order"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="p-2.5 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Database Guarantee:</strong> The inquiry is not wiped. You can access it anytime under the <strong>Trash (Soft-Deleted)</strong> tab and restore it if needed.
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmSoftDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Soft-Deleting..." : "Confirm Soft Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail, Edit & Audit Log Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedInquiry && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <span>Inquiry Reference: {selectedInquiry.inquiryNumber}</span>
                  </DialogTitle>
                  <div>{getStatusBadge(selectedInquiry.status)}</div>
                </div>
                <DialogDescription>
                  Submitted on {new Date(selectedInquiry.createdAt).toLocaleString()}
                </DialogDescription>

                {/* Tabs Bar inside Modal */}
                <div className="flex gap-2 pt-2 border-b">
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all ${
                      activeTab === "details"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1 ${
                      activeTab === "edit"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit Data
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("logs")}
                    className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1 ${
                      activeTab === "logs"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <History className="h-3 w-3" />
                    Audit Logs ({auditLogs.length})
                  </button>
                </div>
              </DialogHeader>

              {/* TAB 1: VIEW DETAILS */}
              {activeTab === "details" && (
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
                        <span className="text-gray-500 text-xs">Cabin &amp; Trip Type:</span>
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
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-dashed border-slate-200">
                        <div className="flex items-center gap-2">
                          {getAirlineLogo(selectedInquiry.selectedAirline) && (
                            <img 
                              src={getAirlineLogo(selectedInquiry.selectedAirline)!} 
                              alt={selectedInquiry.selectedAirline} 
                              className="h-5 w-auto object-contain" 
                            />
                          )}
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Outbound: {selectedInquiry.selectedAirline} {selectedInquiry.flightNumber ? `· Flight ${selectedInquiry.flightNumber}` : ""}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">
                              {selectedInquiry.origin} ➔ {selectedInquiry.destination}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          {selectedInquiry.departDate}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Flight Times:</span>
                          <div className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5 mt-0.5">
                            <span>{selectedInquiry.departureTime || "TBD"}</span>
                            <span className="text-xs text-gray-400 font-mono">({selectedInquiry.origin})</span>
                            <ArrowRight className="h-3 w-3 text-gray-400 shrink-0" />
                            <span>{selectedInquiry.arrivalTime || "TBD"}</span>
                            <span className="text-xs text-gray-400 font-mono">({selectedInquiry.destination})</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Duration &amp; Stops:</span>
                          <div className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            <span>{selectedInquiry.duration || "Direct"} · {selectedInquiry.stops || "Direct"}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Baggage &amp; Cabin:</span>
                          <div className="font-medium text-emerald-700 flex items-center gap-1 mt-0.5">
                            <Luggage className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="truncate">{selectedInquiry.baggage || "1 personal item included"} ({selectedInquiry.cabinClass})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Passenger List */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Traveler Identification Records ({selectedInquiry.passengers?.length || 0})
                      </h4>
                      <div className="border rounded-lg overflow-hidden bg-white">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-gray-50 border-b font-semibold text-gray-500">
                            <tr>
                              <th className="py-2 px-3">#</th>
                              <th className="py-2 px-3">Full Legal Name</th>
                              <th className="py-2 px-3">Type</th>
                              <th className="py-2 px-3">Date of Birth</th>
                              <th className="py-2 px-3">Gender</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selectedInquiry.passengers?.map((p, idx) => (
                              <tr key={p.id || idx}>
                                <td className="py-2 px-3">{idx + 1}</td>
                                <td className="py-2 px-3 font-semibold">{p.fullNameAsPerId}</td>
                                <td className="py-2 px-3">{p.passengerType}</td>
                                <td className="py-2 px-3 font-mono">{p.dob}</td>
                                <td className="py-2 px-3 uppercase">{p.gender}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
              )}

              {/* TAB 2: EDIT DATA */}
              {activeTab === "edit" && (
                <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Edit3 className="h-4 w-4 text-amber-700" />
                      Editing Customer Records
                    </p>
                    <p className="mt-0.5 text-amber-800">
                      Any edits made here will be permanently logged in the audit trail with your timestamp and author signature.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">First Name</Label>
                      <Input 
                        value={editFirstName} 
                        onChange={(e) => setEditFirstName(e.target.value)} 
                        className="text-xs h-9" 
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Last Name</Label>
                      <Input 
                        value={editLastName} 
                        onChange={(e) => setEditLastName(e.target.value)} 
                        className="text-xs h-9" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Phone / WhatsApp</Label>
                      <Input 
                        value={editPhone} 
                        onChange={(e) => setEditPhone(e.target.value)} 
                        className="text-xs h-9" 
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Email</Label>
                      <Input 
                        value={editEmail} 
                        onChange={(e) => setEditEmail(e.target.value)} 
                        className="text-xs h-9" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Departure Date</Label>
                    <Input 
                      value={editDepartDate} 
                      onChange={(e) => setEditDepartDate(e.target.value)} 
                      className="text-xs h-9" 
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Admin Notes</Label>
                    <textarea 
                      rows={2}
                      value={adminNoteInput} 
                      onChange={(e) => setAdminNoteInput(e.target.value)} 
                      className="w-full text-xs p-2 border rounded-md" 
                    />
                  </div>

                  <div className="space-y-1 pt-2 border-t">
                    <Label className="text-xs font-semibold text-primary">
                      Reason for Modification (Logged in Audit):
                    </Label>
                    <Input 
                      placeholder="e.g. Corrected passenger phone typo per customer WhatsApp call"
                      value={editReason}
                      onChange={(e) => setEditReason(e.target.value)}
                      className="text-xs h-9"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setActiveTab("details")}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      size="sm" 
                      disabled={isSavingEdit}
                    >
                      {isSavingEdit ? "Saving & Logging..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              )}

              {/* TAB 3: AUDIT LOGS & HISTORY */}
              {activeTab === "logs" && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="h-4 w-4 text-primary" />
                      Audit Trail &amp; Activity Log
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {auditLogs.length} Logged Action{auditLogs.length === 1 ? "" : "s"}
                    </Badge>
                  </div>

                  {auditLogs.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg bg-gray-50 text-gray-500 text-xs">
                      <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      No edits or soft-delete events recorded yet. All initial creation data is preserved.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {auditLogs.map((log, idx) => (
                        <div 
                          key={log.id || idx} 
                          className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                            log.action === "SOFT_DELETE" 
                              ? "bg-red-50/70 border-red-200" 
                              : log.action === "RESTORE"
                              ? "bg-emerald-50/70 border-emerald-200"
                              : "bg-blue-50/40 border-blue-100"
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span className="flex items-center gap-1.5">
                              {log.action === "SOFT_DELETE" ? (
                                <Badge className="bg-red-600 text-white text-[10px]">SOFT DELETE</Badge>
                              ) : log.action === "RESTORE" ? (
                                <Badge className="bg-emerald-600 text-white text-[10px]">RESTORED</Badge>
                              ) : (
                                <Badge className="bg-blue-600 text-white text-[10px]">MODIFIED</Badge>
                              )}
                              <span className="text-gray-900">{log.author}</span>
                            </span>
                            <span className="text-[11px] font-mono text-gray-500">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>

                          {log.details && (
                            <p className="text-gray-700 font-medium">{log.details}</p>
                          )}

                          {log.reason && (
                            <p className="text-red-700 font-medium">Reason: {log.reason}</p>
                          )}

                          {log.changes && log.changes.length > 0 && (
                            <div className="mt-1 pt-1.5 border-t border-slate-200/60 space-y-1 font-mono text-[11px]">
                              {log.changes.map((c, cIdx) => (
                                <div key={cIdx} className="flex items-center gap-1 text-gray-600">
                                  <span className="font-semibold text-gray-800">{c.field}:</span>
                                  <span className="line-through text-red-500">{String(c.from)}</span>
                                  <span>➔</span>
                                  <span className="text-emerald-700 font-bold">{String(c.to)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
