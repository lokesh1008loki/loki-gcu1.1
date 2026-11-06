"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  CreditCard, 
  Plus, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Send, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  DollarSign, 
  Receipt, 
  Clock, 
  Smartphone,
  Check,
  Trash2
} from "lucide-react"
import { toast } from "sonner"

interface PaymentInvoice {
  id: string
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  category: string
  amount: number
  description: string
  checkoutUrl: string
  localPayUrl: string
  status: "PENDING" | "PAID" | "EXPIRED"
  createdAt: string
}

const PRESET_AMOUNTS = [29.99, 50, 100, 250, 500, 1000]

const CATEGORIES = [
  "Rent & Housing Assistance",
  "Flight & Travel Bookings",
  "Hotel & Accommodation",
  "Electric & Utility Bills",
  "Theme Park & Event Tickets",
  "IKEA & Shopping Orders",
  "General Consultation Fee",
]

export default function CyberbizPaymentsPage() {
  const [invoices, setInvoices] = useState<PaymentInvoice[]>([])
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Form state
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [amount, setAmount] = useState<string>("29.99")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [description, setDescription] = useState("GoComfortUSA Service Payment")
  const [activeGeneratedInvoice, setActiveGeneratedInvoice] = useState<PaymentInvoice | null>(null)

  // Load saved invoices from localStorage (cleans out demo items)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gcu_cyberbiz_invoices")
      if (saved) {
        const parsed: PaymentInvoice[] = JSON.parse(saved)
        // Clean out demo samples (IDs "1", "2")
        const clean = parsed.filter(i => i.id !== "1" && i.id !== "2")
        setInvoices(clean)
        localStorage.setItem("gcu_cyberbiz_invoices", JSON.stringify(clean))
      } else {
        setInvoices([])
      }
    } catch {
      setInvoices([])
    }
  }, [])

  const deleteInvoice = (id: string) => {
    const updated = invoices.filter(inv => inv.id !== id)
    saveInvoices(updated)
    toast.success("Invoice removed")
  }

  const clearAllInvoices = () => {
    if (confirm("Are you sure you want to clear all invoice history?")) {
      saveInvoices([])
      toast.success("All invoices cleared")
    }
  }

  const saveInvoices = (updated: PaymentInvoice[]) => {
    setInvoices(updated)
    try {
      localStorage.setItem("gcu_cyberbiz_invoices", JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid payment amount")
      return
    }

    try {
      setIsGenerating(true)
      const res = await fetch("/api/payment/cyberbiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          description: `${category}: ${description}`,
          customerName,
          customerEmail,
          customerPhone,
        })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create payment invoice")
      }

      const localPayUrl = `${window.location.origin}/pay?amount=${numAmount}&service=${encodeURIComponent(category)}&order_id=${encodeURIComponent(data.orderId)}`

      const newInvoice: PaymentInvoice = {
        id: Date.now().toString(),
        orderId: data.orderId,
        customerName: customerName || "Guest Customer",
        customerEmail,
        customerPhone,
        category,
        amount: numAmount,
        description,
        checkoutUrl: data.checkoutUrl,
        localPayUrl,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      }

      const updated = [newInvoice, ...invoices]
      saveInvoices(updated)
      setActiveGeneratedInvoice(newInvoice)
      toast.success("CyberBiz payment link generated!")
    } catch (err: any) {
      toast.error(err.message || "Failed to generate payment link")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setCopiedId(null), 2500)
  }

  const openWhatsApp = (invoice: PaymentInvoice) => {
    const text = `Hello ${invoice.customerName}! Here is your GoComfortUSA payment invoice for ${invoice.category} ($${invoice.amount.toFixed(2)} USD):\n\nPay securely here: ${invoice.localPayUrl}\n\nInvoice Ref: ${invoice.orderId}\nThank you!`
    window.open(`https://wa.me/${invoice.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`, "_blank")
  }

  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.amount, 0)
  const paidCount = invoices.filter(inv => inv.status === "PAID").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-primary" />
            CyberBiz Payment Gateway & Invoices
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate custom client payment links, manage invoices, and monitor CyberBiz transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <a href="https://lk.cyberbiz.bz/dev/" target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              CyberBiz Dashboard
            </a>
          </Button>
          <Button asChild>
            <a href="/pay" target="_blank">
              <Receipt className="h-4 w-4 mr-2" />
              Open Live Pay Page
            </a>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Merchant ID</CardDescription>
            <CardTitle className="text-xl font-mono text-primary">#1793867127</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-xs text-muted-foreground">Domain: gocomfortusa.com</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Gateway Status</CardDescription>
            <CardTitle className="text-xl flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
                Connected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-xs text-muted-foreground">Level: Medium Tier</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Total Invoiced</CardDescription>
            <CardTitle className="text-xl font-bold">${totalInvoiced.toFixed(2)} USD</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-xs text-muted-foreground">{invoices.length} invoices generated</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Successful Orders</CardDescription>
            <CardTitle className="text-xl font-bold text-emerald-600">{paidCount} Paid</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-xs text-muted-foreground">{invoices.length - paidCount} pending checkout</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Link Generator Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Create Custom Payment Link / Invoice
            </CardTitle>
            <CardDescription>
              Enter the client&apos;s details to generate a branded CyberBiz payment invoice link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateInvoice} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custName">Customer Full Name</Label>
                  <Input 
                    id="custName" 
                    placeholder="e.g. John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Service Category</Label>
                  <select 
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custEmail">Customer Email</Label>
                  <Input 
                    id="custEmail" 
                    type="email"
                    placeholder="client@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custPhone">Customer Phone / WhatsApp</Label>
                  <Input 
                    id="custPhone" 
                    placeholder="+1 (555) 000-0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Amount Selection */}
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount ($ USD)</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">$</span>
                    <Input 
                      id="amount" 
                      type="number"
                      step="0.01"
                      className="pl-8 font-semibold text-base"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Preset Amount Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_AMOUNTS.map((p) => (
                    <Button
                      key={p}
                      type="button"
                      variant={parseFloat(amount) === p ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-7 px-2.5"
                      onClick={() => setAmount(p.toString())}
                    >
                      ${p}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc">Order Description / Notes</Label>
                <Textarea 
                  id="desc"
                  rows={2}
                  placeholder="e.g. Utility bill payment assistance for account #94827"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating CyberBiz Link...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Payment Link ($ {parseFloat(amount || "0").toFixed(2)})
                  </>
                )}
              </Button>
            </form>

            {/* Generated Link Alert Display */}
            {activeGeneratedInvoice && (
              <div className="mt-6 p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Payment Link Ready: Ref #{activeGeneratedInvoice.orderId}
                  </span>
                  <Badge className="bg-emerald-600">${activeGeneratedInvoice.amount.toFixed(2)} USD</Badge>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Customer Checkout Link (GoComfortUSA branded):</Label>
                  <div className="flex gap-2">
                    <Input 
                      readOnly 
                      value={activeGeneratedInvoice.localPayUrl} 
                      className="bg-white text-xs font-mono"
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={() => copyToClipboard(activeGeneratedInvoice.localPayUrl, "active-local")}
                    >
                      {copiedId === "active-local" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-xs bg-white"
                    onClick={() => window.open(activeGeneratedInvoice.localPayUrl, "_blank")}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Test Checkout
                  </Button>

                  {activeGeneratedInvoice.customerPhone && (
                    <Button 
                      type="button" 
                      size="sm" 
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => openWhatsApp(activeGeneratedInvoice)}
                    >
                      <Smartphone className="h-3.5 w-3.5 mr-1" />
                      Send via WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Gateway Settings & Webhooks */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                CyberBiz Gateway Credentials
              </CardTitle>
              <CardDescription className="text-xs">
                Active credentials configured on GoComfortUSA server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">Shop / Merchant ID</span>
                <p className="font-mono font-bold text-gray-900">1793867127</p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Secret Key</span>
                  <button 
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {showSecretKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showSecretKey ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="font-mono text-xs text-gray-800 bg-gray-100 p-1.5 rounded">
                  {showSecretKey ? "gF4xbTGdSfzoRXP9Lp" : "••••••••••••••••••"}
                </p>
              </div>

              <div>
                <span className="text-xs text-muted-foreground">Webhook Callback URL</span>
                <p className="font-mono text-xs text-gray-600 break-all bg-gray-50 p-1.5 rounded border">
                  https://gocomfortusa.com/api/payment/cyberbiz/webhook
                </p>
              </div>

              <div>
                <span className="text-xs text-muted-foreground">Success Return URL</span>
                <p className="font-mono text-xs text-gray-600 break-all bg-gray-50 p-1.5 rounded border">
                  https://gocomfortusa.com/payment/success
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/40">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900">
                Activation Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs space-y-2 text-blue-950">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Meta tag verified in site &lt;head&gt;</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Webhook endpoint handles HMAC &amp; health checks</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Enable &quot;Test Payments&quot; toggle in CyberBiz dashboard for instant testing</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Recent Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Generated Payment Invoices
              </CardTitle>
              <CardDescription>
                Recent payment links generated for customers
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {invoices.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={clearAllInvoices}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Clear All
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const refreshed = [...invoices]
                  saveInvoices(refreshed)
                  toast.success("List refreshed")
                }}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No invoices generated yet. Use the form above to generate your first payment link.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Order Ref</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-mono font-medium text-xs">
                        {inv.orderId}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{inv.customerName}</div>
                        {inv.customerPhone && (
                          <div className="text-xs text-muted-foreground">{inv.customerPhone}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {inv.category}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        ${inv.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant="outline" 
                          className={
                            inv.status === "PAID" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : "bg-amber-50 text-amber-700 border-amber-300"
                          }
                        >
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-2"
                          onClick={() => copyToClipboard(inv.localPayUrl, inv.id)}
                          title="Copy Link"
                        >
                          {copiedId === inv.id ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-2"
                          onClick={() => window.open(inv.localPayUrl, "_blank")}
                          title="Open Checkout"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        {inv.customerPhone && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            onClick={() => openWhatsApp(inv)}
                            title="Share via WhatsApp"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteInvoice(inv.id)}
                          title="Delete Invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

