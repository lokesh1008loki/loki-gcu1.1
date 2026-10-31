"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Hotel,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  RefreshCw,
  Eye,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Users,
  Trash2,
  Percent,
  Check,
  Plane,
  Package,
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
import { toast } from "sonner";

interface HotelInquiry {
  id: string;
  inquiryNumber: string;
  customerName: string;
  phoneNumber: string;
  email?: string | null;
  hotelName: string;
  hotelUrl?: string | null;
  imageUrl?: string | null;
  location?: string | null;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfRooms: number;
  numberOfAdults: number;
  numberOfChildren: number;
  roomType?: string | null;
  retailPrice: number;
  discountPercent: number;
  quotePrice: number;
  specialRequests?: string | null;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
}

export default function AdminHotelsDashboardPage() {
  const [inquiries, setInquiries] = useState<HotelInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInquiry, setSelectedInquiry] = useState<HotelInquiry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchInquiries = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/admin/hotels/inquiries", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error("Failed to load hotel inquiries:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchInquiries(true);
    }, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedInquiry) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch("/api/admin/hotels/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedInquiry.id,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === selectedInquiry.id ? { ...inq, status: newStatus } : inq))
        );
        toast.success(`Inquiry marked as ${newStatus}`);
      } else {
        toast.error("Failed to update status.");
      }
    } catch (e) {
      toast.error("Error updating status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hotel inquiry?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/hotels/inquiries?id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        setDialogOpen(false);
        toast.success("Inquiry deleted successfully.");
      } else {
        if (res.status === 404 || data?.deletedCount === 0 || !data?.success) {
          setInquiries((prev) => prev.filter((inq) => inq.id !== id));
          setDialogOpen(false);
          toast.success("Inquiry removed.");
        } else {
          toast.error(data?.error || data?.details || "Failed to delete inquiry.");
        }
      }
    } catch (e: any) {
      toast.error(e?.message || "Error deleting inquiry.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const q = search.toLowerCase();
    const matchesSearch =
      inq.inquiryNumber.toLowerCase().includes(q) ||
      inq.customerName.toLowerCase().includes(q) ||
      inq.phoneNumber.toLowerCase().includes(q) ||
      inq.hotelName.toLowerCase().includes(q) ||
      (inq.location && inq.location.toLowerCase().includes(q)) ||
      (inq.email && inq.email.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "ALL" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInquiries = inquiries.length;
  const pendingCount = inquiries.filter((i) => i.status === "PENDING").length;
  const confirmedCount = inquiries.filter((i) => i.status === "CONFIRMED").length;
  const totalPipelineValue = inquiries
    .reduce((acc, curr) => acc + (curr.quotePrice || 0), 0)
    .toFixed(2);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Hotel Customer Inquiries
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time Booking.com hotel reservations, stay quotes, and 30% discount tracking.
          </p>
        </div>

        {/* Quick Nav Switcher & Controls */}
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard/travel">
            <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer text-xs">
              <Plane className="w-3.5 h-3.5 text-blue-500" />
              <span>Flights</span>
            </Button>
          </Link>

          <Link href="/admin/dashboard/ikea">
            <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer text-xs">
              <Package className="w-3.5 h-3.5 text-amber-500" />
              <span>IKEA Orders</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`gap-1.5 text-xs cursor-pointer ${
              autoRefresh ? "border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20" : ""
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
            <span>{autoRefresh ? "Auto-refresh (8s)" : "Paused"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchInquiries(false)}
            disabled={loading}
            className="gap-1.5 text-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-xs border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Inquiries
            </CardTitle>
            <Building2 className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{totalInquiries}</div>
            <p className="text-xs text-muted-foreground mt-1">All hotel quotes submitted</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pending Action
            </CardTitle>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting guest call / booking</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Confirmed
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-600">{confirmedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Reservation booked</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs border-l-4 border-l-teal-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pipeline Value
            </CardTitle>
            <DollarSign className="w-4 h-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-teal-600">${totalPipelineValue}</div>
            <p className="text-xs text-muted-foreground mt-1">Total stay booking value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 shadow-xs border-border">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {["ALL", "PENDING", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="text-xs font-bold cursor-pointer"
              >
                {status}
              </Button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search guest, hotel, phone, ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9 font-medium"
            />
          </div>
        </div>
      </Card>

      {/* Inquiries Table */}
      <Card className="overflow-hidden border-border shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Inquiry Ref</th>
                <th className="py-3 px-4">Guest Details</th>
                <th className="py-3 px-4">Hotel &amp; Destination</th>
                <th className="py-3 px-4">Stay Dates</th>
                <th className="py-3 px-4">Pricing (~30% OFF)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                      <span>Loading hotel inquiries...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Hotel className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                    <span>No hotel inquiries found matching your filters.</span>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-muted/40 transition-colors">
                    {/* Inquiry Ref */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                        {inq.inquiryNumber}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Guest Details */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-foreground">{inq.customerName}</div>
                      <div className="text-xs text-blue-600 font-mono">
                        <a href={`tel:${inq.phoneNumber}`}>{inq.phoneNumber}</a>
                      </div>
                      {inq.email && (
                        <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                          {inq.email}
                        </div>
                      )}
                    </td>

                    {/* Hotel Details */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {inq.imageUrl && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-border bg-slate-100">
                            <Image
                              src={inq.imageUrl}
                              alt={inq.hotelName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-foreground text-xs line-clamp-1">
                            {inq.hotelName}
                          </div>
                          {inq.location && (
                            <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                              {inq.location}
                            </div>
                          )}
                          {inq.roomType && (
                            <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                              {inq.roomType}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Stay Dates */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs font-semibold text-foreground">
                        {inq.checkInDate} &rarr; {inq.checkOutDate}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {inq.numberOfNights} night{inq.numberOfNights > 1 ? "s" : ""} &bull; {inq.numberOfAdults} adults
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        ${inq.quotePrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground line-through">
                        ${inq.retailPrice.toFixed(2)}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600">
                        Save ${(inq.retailPrice - inq.quotePrice).toFixed(2)} (30%)
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <Badge
                        className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 ${
                          inq.status === "PENDING"
                            ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700"
                            : inq.status === "CONTACTED"
                            ? "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700"
                            : inq.status === "CONFIRMED"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700"
                            : inq.status === "COMPLETED"
                            ? "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {inq.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedInquiry(inq);
                          setDialogOpen(true);
                        }}
                        className="gap-1.5 text-xs font-bold cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inquiry Detail Inspection Dialog */}
      {selectedInquiry && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Hotel className="w-5 h-5 text-blue-600" />
                    <span>Inquiry {selectedInquiry.inquiryNumber}</span>
                  </DialogTitle>
                  <DialogDescription>
                    Submitted on {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </DialogDescription>
                </div>
                <Badge className="text-xs uppercase font-bold tracking-wider">
                  {selectedInquiry.status}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Hotel Summary */}
              <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-4">
                {selectedInquiry.imageUrl && (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border bg-slate-200">
                    <Image
                      src={selectedInquiry.imageUrl}
                      alt={selectedInquiry.hotelName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-base text-foreground truncate">
                    {selectedInquiry.hotelName}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">{selectedInquiry.location}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-black text-emerald-600">
                      ${selectedInquiry.quotePrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      ${selectedInquiry.retailPrice.toFixed(2)}
                    </span>
                    <Badge className="bg-emerald-600 text-white text-[10px]">
                      Save ${(selectedInquiry.retailPrice - selectedInquiry.quotePrice).toFixed(2)} (30% OFF)
                    </Badge>
                  </div>
                </div>

                {selectedInquiry.hotelUrl && (
                  <a
                    href={selectedInquiry.hotelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>

              {/* Guest & Stay Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Guest Contact */}
                <div className="p-4 rounded-xl border border-border space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Guest Information
                  </span>
                  <div className="font-bold text-foreground text-base">
                    {selectedInquiry.customerName}
                  </div>
                  <div className="text-sm text-blue-600 font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <a href={`tel:${selectedInquiry.phoneNumber}`}>{selectedInquiry.phoneNumber}</a>
                  </div>
                  {selectedInquiry.email && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      <a href={`mailto:${selectedInquiry.email}`}>{selectedInquiry.email}</a>
                    </div>
                  )}
                </div>

                {/* Stay Configuration */}
                <div className="p-4 rounded-xl border border-border space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Stay Requirements
                  </span>
                  <div className="text-xs space-y-1 text-foreground">
                    <p>
                      <strong>Dates:</strong> {selectedInquiry.checkInDate} &rarr; {selectedInquiry.checkOutDate} ({selectedInquiry.numberOfNights} nights)
                    </p>
                    <p>
                      <strong>Occupancy:</strong> {selectedInquiry.numberOfAdults} Adults, {selectedInquiry.numberOfChildren} Children
                    </p>
                    <p>
                      <strong>Rooms:</strong> {selectedInquiry.numberOfRooms} Room{selectedInquiry.numberOfRooms > 1 ? "s" : ""}
                    </p>
                    {selectedInquiry.roomType && (
                      <p>
                        <strong>Room Type:</strong> {selectedInquiry.roomType}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedInquiry.specialRequests && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-bold block mb-1">Guest Special Requests:</span>
                  <p>{selectedInquiry.specialRequests}</p>
                </div>
              )}

              {/* Change Inquiry Status */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Change Reservation Status
                </span>
                <div className="flex flex-wrap gap-2">
                  {["PENDING", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
                    <Button
                      key={st}
                      size="sm"
                      variant={selectedInquiry.status === st ? "default" : "outline"}
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus(st)}
                      className="text-xs font-bold cursor-pointer"
                    >
                      {selectedInquiry.status === st && <Check className="w-3.5 h-3.5 mr-1" />}
                      <span>{st}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === selectedInquiry.id}
                  onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                  className="gap-1.5 text-xs cursor-pointer"
                >
                  {deletingId === selectedInquiry.id ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Inquiry</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(false)}
                  className="cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

