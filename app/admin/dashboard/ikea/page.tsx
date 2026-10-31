"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Truck,
  Store,
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
  Calendar,
  X,
  Trash2,
  Percent,
  Check,
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

interface IkeaInquiry {
  id: string;
  inquiryNumber: string;
  customerName: string;
  phoneNumber: string;
  email?: string | null;
  itemNumber: string;
  productName: string;
  productType?: string | null;
  productUrl?: string | null;
  imageUrl?: string | null;
  ikeaPrice: number;
  discountPercent: number;
  quotePrice: number;
  serviceType: string;
  storeLocation?: string | null;
  deliveryZip?: string | null;
  deliveryAddress?: string | null;
  customerNotes?: string | null;
  status: string;
  createdAt: string;
}

export default function AdminIkeaInquiriesPage() {
  const [inquiries, setInquiries] = useState<IkeaInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInquiry, setSelectedInquiry] = useState<IkeaInquiry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const fetchInquiries = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/admin/ikea/inquiries", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Failed to load IKEA inquiries:", err);
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
      const res = await fetch("/api/admin/ikea/inquiries", {
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
    if (!confirm("Are you sure you want to delete this IKEA inquiry?")) return;
    try {
      const res = await fetch(`/api/admin/ikea/inquiries?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        setDialogOpen(false);
        toast.success("Inquiry deleted.");
      } else {
        toast.error("Failed to delete inquiry.");
      }
    } catch (e) {
      toast.error("Error deleting inquiry.");
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.inquiryNumber.toLowerCase().includes(search.toLowerCase()) ||
      inq.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inq.phoneNumber.toLowerCase().includes(search.toLowerCase()) ||
      inq.productName.toLowerCase().includes(search.toLowerCase()) ||
      inq.itemNumber.toLowerCase().includes(search.toLowerCase()) ||
      (inq.email && inq.email.toLowerCase().includes(search.toLowerCase()));

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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Package className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              IKEA Customer Inquiries
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time IKEA quote submissions, store pickups, direct deliveries, and 30% discount tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard/travel">
            <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer text-xs">
              <span>✈️ View Flight Inquiries</span>
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-xs border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Inquiries
            </CardTitle>
            <Package className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{totalInquiries}</div>
            <p className="text-xs text-muted-foreground mt-1">All recorded quote requests</p>
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
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires customer contact</p>
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
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{confirmedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully booked &amp; scheduled</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pipeline Value
            </CardTitle>
            <DollarSign className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">${totalPipelineValue}</div>
            <p className="text-xs text-muted-foreground mt-1">Total customer quote volume</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer, phone, item #, or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {["ALL", "PENDING", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
              <Button
                key={st}
                size="sm"
                variant={statusFilter === st ? "default" : "outline"}
                onClick={() => setStatusFilter(st)}
                className="text-xs font-bold h-8 px-3 cursor-pointer shrink-0"
              >
                {st}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inquiries Table */}
      <Card className="border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[11px] tracking-wider font-bold border-b border-border">
              <tr>
                <th className="py-3.5 px-4">Inquiry Ref</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Fulfillment</th>
                <th className="py-3.5 px-4">Pricing (~30% OFF)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                    <span>Loading IKEA inquiries...</span>
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    <Package className="w-10 h-10 mx-auto mb-2 stroke-1 text-muted-foreground/60" />
                    <p className="font-semibold">No IKEA inquiries found</p>
                    <p className="text-xs mt-1">Submitted quote inquiries from customers will appear here automatically.</p>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-muted/30 transition-colors">
                    {/* Inquiry Ref */}
                    <td className="py-4 px-4 font-mono font-bold text-xs text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {inq.inquiryNumber}
                      <span className="block text-[10px] font-sans font-normal text-muted-foreground mt-0.5">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-bold text-foreground text-sm">{inq.customerName}</div>
                      <a
                        href={`tel:${inq.phoneNumber}`}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{inq.phoneNumber}</span>
                      </a>
                      {inq.email && (
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate max-w-[180px]">
                          <Mail className="w-3 h-3" />
                          <span>{inq.email}</span>
                        </div>
                      )}
                    </td>

                    {/* Product */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {inq.imageUrl ? (
                          <img
                            src={inq.imageUrl}
                            alt={inq.productName}
                            className="w-12 h-12 object-contain rounded-lg bg-white dark:bg-slate-900 border p-1 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-extrabold text-foreground text-sm block truncate max-w-[200px]">
                            {inq.productName}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                            <span className="font-mono">#{inq.itemNumber}</span>
                            {inq.productType && <span>· {inq.productType}</span>}
                          </div>
                          {inq.productUrl && (
                            <a
                              href={inq.productUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-blue-500 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                            >
                              <span>IKEA.com</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Fulfillment */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {inq.serviceType === "PICKUP" ? (
                        <div>
                          <Badge variant="outline" className="gap-1 border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20 text-[11px]">
                            <Store className="w-3 h-3" />
                            <span>Store Pickup</span>
                          </Badge>
                          <span className="block text-xs text-muted-foreground mt-1 max-w-[180px] truncate">
                            {inq.storeLocation || "Store not specified"}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 text-[11px]">
                            <Truck className="w-3 h-3" />
                            <span>Direct Delivery</span>
                          </Badge>
                          <span className="block text-xs font-mono text-muted-foreground mt-1">
                            ZIP: {inq.deliveryZip || "N/A"}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Pricing */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-black text-base text-emerald-600 dark:text-emerald-400">
                        ${inq.quotePrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground line-through">
                        IKEA: ${inq.ikeaPrice.toFixed(2)}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Save ${(inq.ikeaPrice - inq.quotePrice).toFixed(2)} ({inq.discountPercent}%)
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
                    <span>Inquiry</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">
                      {selectedInquiry.inquiryNumber}
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Submitted on {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </DialogDescription>
                </div>
                <Badge className="text-xs uppercase font-bold">{selectedInquiry.status}</Badge>
              </div>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Product Card */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center gap-4">
                {selectedInquiry.imageUrl && (
                  <img
                    src={selectedInquiry.imageUrl}
                    alt={selectedInquiry.productName}
                    className="w-20 h-20 object-contain rounded-xl bg-white dark:bg-slate-900 border p-1"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      #{selectedInquiry.itemNumber}
                    </span>
                    {selectedInquiry.productType && (
                      <span className="text-xs text-muted-foreground font-semibold">
                        · {selectedInquiry.productType}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-foreground truncate">
                    {selectedInquiry.productName}
                  </h3>
                  <div className="flex items-baseline gap-3 mt-1.5">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      ${selectedInquiry.quotePrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      IKEA: ${selectedInquiry.ikeaPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      Save ${(selectedInquiry.ikeaPrice - selectedInquiry.quotePrice).toFixed(2)} (30% OFF)
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Contact & Logistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Customer Information
                  </span>
                  <div className="font-bold text-foreground text-base">{selectedInquiry.customerName}</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <a href={`tel:${selectedInquiry.phoneNumber}`}>{selectedInquiry.phoneNumber}</a>
                  </div>
                  {selectedInquiry.email && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{selectedInquiry.email}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-border space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Fulfillment &amp; Location
                  </span>
                  <div className="flex items-center gap-2">
                    {selectedInquiry.serviceType === "PICKUP" ? (
                      <Badge className="bg-blue-600 text-white gap-1 text-xs">
                        <Store className="w-3 h-3" />
                        <span>Store Pickup</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-600 text-white gap-1 text-xs">
                        <Truck className="w-3 h-3" />
                        <span>Direct Delivery</span>
                      </Badge>
                    )}
                  </div>
                  {selectedInquiry.serviceType === "PICKUP" ? (
                    <p className="text-sm text-foreground font-medium">
                      {selectedInquiry.storeLocation || "No store selected"}
                    </p>
                  ) : (
                    <div className="text-xs space-y-1 text-foreground">
                      <p className="font-mono">ZIP: {selectedInquiry.deliveryZip || "N/A"}</p>
                      {selectedInquiry.deliveryAddress && (
                        <p className="text-muted-foreground">Address: {selectedInquiry.deliveryAddress}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Notes */}
              {selectedInquiry.customerNotes && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-bold block mb-1">Customer Special Instructions:</span>
                  <p>{selectedInquiry.customerNotes}</p>
                </div>
              )}

              {/* Quick Status Updater */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Change Inquiry Status
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
                  onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                  className="gap-1.5 text-xs cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Inquiry</span>
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

