"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Search,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Truck,
  Store,
  Star,
  ArrowRight,
  ExternalLink,
  X,
  ShieldCheck,
  Percent,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  MapPin,
  Tag,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// Complete 40+ US IKEA store locations
const ikeaStores = [
  { id: "1", name: "IKEA Burbank", city: "Burbank", state: "CA", zip: "91502" },
  { id: "2", name: "IKEA Carson", city: "Carson", state: "CA", zip: "90746" },
  { id: "3", name: "IKEA Emeryville", city: "Emeryville", state: "CA", zip: "94608" },
  { id: "4", name: "IKEA East Palo Alto", city: "East Palo Alto", state: "CA", zip: "94303" },
  { id: "5", name: "IKEA West Sacramento", city: "West Sacramento", state: "CA", zip: "95691" },
  { id: "6", name: "IKEA Portland", city: "Portland", state: "OR", zip: "97223" },
  { id: "7", name: "IKEA Seattle", city: "Seattle", state: "WA", zip: "98188" },
  { id: "8", name: "IKEA Las Vegas", city: "Las Vegas", state: "NV", zip: "89115" },
  { id: "9", name: "IKEA Tempe", city: "Tempe", state: "AZ", zip: "85281" },
  { id: "10", name: "IKEA Centennial", city: "Centennial", state: "CO", zip: "80112" },
  { id: "11", name: "IKEA Draper", city: "Draper", state: "UT", zip: "84020" },
  { id: "12", name: "IKEA Round Rock", city: "Round Rock", state: "TX", zip: "78664" },
  { id: "13", name: "IKEA Grand Prairie", city: "Grand Prairie", state: "TX", zip: "75052" },
  { id: "14", name: "IKEA Houston", city: "Houston", state: "TX", zip: "77038" },
  { id: "15", name: "IKEA Live Oak", city: "Live Oak", state: "TX", zip: "78233" },
  { id: "16", name: "IKEA Frisco", city: "Frisco", state: "TX", zip: "75034" },
  { id: "17", name: "IKEA Merriam", city: "Merriam", state: "KS", zip: "66203" },
  { id: "18", name: "IKEA Fishers", city: "Fishers", state: "IN", zip: "46037" },
  { id: "19", name: "IKEA Bolingbrook", city: "Bolingbrook", state: "IL", zip: "60440" },
  { id: "20", name: "IKEA Schaumburg", city: "Schaumburg", state: "IL", zip: "60173" },
  { id: "21", name: "IKEA Oak Creek", city: "Oak Creek", state: "WI", zip: "53154" },
  { id: "22", name: "IKEA Bloomington", city: "Bloomington", state: "MN", zip: "55425" },
  { id: "23", name: "IKEA Charlotte", city: "Charlotte", state: "NC", zip: "28278" },
  { id: "24", name: "IKEA Atlanta", city: "Atlanta", state: "GA", zip: "30360" },
  { id: "25", name: "IKEA Sunrise", city: "Sunrise", state: "FL", zip: "33323" },
  { id: "26", name: "IKEA Orlando", city: "Orlando", state: "FL", zip: "32819" },
  { id: "27", name: "IKEA Tampa", city: "Tampa", state: "FL", zip: "33619" },
  { id: "28", name: "IKEA Jacksonville", city: "Jacksonville", state: "FL", zip: "32256" },
  { id: "29", name: "IKEA Elizabeth", city: "Elizabeth", state: "NJ", zip: "07201" },
  { id: "30", name: "IKEA Paramus", city: "Paramus", state: "NJ", zip: "07652" },
  { id: "31", name: "IKEA Brooklyn", city: "Brooklyn", state: "NY", zip: "11220" },
  { id: "32", name: "IKEA Long Island", city: "Hicksville", state: "NY", zip: "11801" },
  { id: "33", name: "IKEA New Haven", city: "New Haven", state: "CT", zip: "06513" },
  { id: "34", name: "IKEA Stoughton", city: "Stoughton", state: "MA", zip: "02072" },
  { id: "35", name: "IKEA Philadelphia", city: "Philadelphia", state: "PA", zip: "19148" },
  { id: "36", name: "IKEA Pittsburgh", city: "Pittsburgh", state: "PA", zip: "15275" },
  { id: "37", name: "IKEA Baltimore", city: "Baltimore", state: "MD", zip: "21240" },
  { id: "38", name: "IKEA College Park", city: "College Park", state: "MD", zip: "20740" },
  { id: "39", name: "IKEA Woodbridge", city: "Woodbridge", state: "VA", zip: "22192" },
  { id: "40", name: "IKEA Norfolk", city: "Norfolk", state: "VA", zip: "23502" },
];

const categoryChips = [
  { label: "Sofas & Couches", query: "sofa" },
  { label: "Desks & Workspaces", query: "desk" },
  { label: "Beds & Mattresses", query: "bed" },
  { label: "Bookcases & Storage", query: "kallax" },
  { label: "Dining Tables", query: "dining table" },
  { label: "Gaming Chairs", query: "gaming chair" },
  { label: "Lighting", query: "lamp" },
  { label: "Wardrobes", query: "pax" },
];

interface IkeaProduct {
  id: string;
  itemNo: string;
  name: string;
  typeName: string;
  itemMeasureReferenceText: string;
  currency: string;
  retailPrice: number;
  discountPercent: number;
  discountedPrice: number;
  savings: number;
  formattedRetailPrice: string;
  formattedDiscountedPrice: string;
  formattedSavings: string;
  imageUrl: string;
  contextualImageUrl: string;
  pipUrl: string;
  rating: number | null;
  ratingCount: number;
  colors: string[];
}

export default function IkeaCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("sofa");
  const [inputValue, setInputValue] = useState("sofa");
  const [products, setProducts] = useState<IkeaProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quote / Order Modal state
  const [selectedProduct, setSelectedProduct] = useState<IkeaProduct | null>(null);
  const [serviceType, setServiceType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStore, setSelectedStore] = useState(ikeaStores[0].name);
  const [deliveryZip, setDeliveryZip] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiryNumber, setSubmittedInquiryNumber] = useState<string | null>(null);

  // Fetch IKEA products
  const fetchProducts = async (q: string) => {
    if (!q.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ikea/search?q=${encodeURIComponent(q.trim())}&size=24`);
      if (!res.ok) {
        throw new Error("Unable to fetch IKEA catalog at this time.");
      }
      const data = await res.json();
      if (data.status === "success" && Array.isArray(data.products)) {
        setProducts(data.products);
        if (data.products.length === 0) {
          setError(`No IKEA products found for "${q}". Try another search term.`);
        }
      } else {
        throw new Error(data.error || "Failed to load products.");
      }
    } catch (err: any) {
      console.error("IKEA Search Client Error:", err);
      setError(err?.message || "Failed to retrieve products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts("sofa");
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchQuery(inputValue.trim());
      fetchProducts(inputValue.trim());
    }
  };

  const handleChipClick = (query: string) => {
    setInputValue(query);
    setSearchQuery(query);
    fetchProducts(query);
  };

  const handleOpenQuoteModal = (product: IkeaProduct) => {
    setSelectedProduct(product);
    setSubmittedInquiryNumber(null);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setSubmittedInquiryNumber(null);
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    const digitsOnly = phoneNumber.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      toast.error("Please enter a valid phone number with at least 10 digits.");
      return;
    }

    if (serviceType === "DELIVERY" && !deliveryZip.trim()) {
      toast.error("Please enter your delivery ZIP code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/ikea/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phoneNumber,
          email,
          itemNumber: selectedProduct?.itemNo,
          productName: selectedProduct?.name,
          productType: selectedProduct?.typeName,
          productUrl: selectedProduct?.pipUrl,
          imageUrl: selectedProduct?.imageUrl,
          ikeaPrice: selectedProduct?.retailPrice,
          discountPercent: selectedProduct?.discountPercent || 30,
          quotePrice: selectedProduct?.discountedPrice,
          serviceType,
          storeLocation: serviceType === "PICKUP" ? selectedStore : null,
          deliveryZip: serviceType === "DELIVERY" ? deliveryZip : null,
          deliveryAddress: serviceType === "DELIVERY" ? deliveryAddress : null,
          customerNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedInquiryNumber(data.inquiryNumber);
        toast.success(`Quote requested! Reference #${data.inquiryNumber}`);
      } else {
        throw new Error(data.error || "Failed to submit quote inquiry.");
      }
    } catch (err: any) {
      console.error("Quote submission error:", err);
      toast.error(err?.message || "Failed to submit quote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero & Search Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_50%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>GoComfortUSA Exclusive ~30% Member Discount</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-sm">
            IKEA® Furniture &amp; Home Explorer
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Search live IKEA products with instant pricing, high-definition photos, and discounted procurement directly through GoComfortUSA.
          </p>

          {/* Interactive Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto relative flex items-center bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-2 border border-slate-200 dark:border-slate-800 transition-all focus-within:ring-4 focus-within:ring-blue-500/20"
          >
            <div className="pl-3.5 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search IKEA products (e.g. UPPLAND, sofa, desk, kallax, bed)..."
              className="w-full px-3 py-2.5 text-sm sm:text-base bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden font-medium"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue("")}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </span>
              ) : (
                <span>Search</span>
              )}
            </Button>
          </form>

          {/* Quick Filter Category Chips */}
          <div className="pt-2 flex flex-wrap justify-center items-center gap-2 max-w-4xl mx-auto">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mr-1">
              Popular:
            </span>
            {categoryChips.map((chip) => (
              <button
                key={chip.query}
                type="button"
                onClick={() => handleChipClick(chip.query)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  searchQuery.toLowerCase() === chip.query.toLowerCase()
                    ? "bg-amber-400 text-slate-950 font-bold shadow-md scale-105"
                    : "bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 backdrop-blur-sm"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Product Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Results for</span>
              <span className="text-blue-600 dark:text-blue-400 capitalize">&ldquo;{searchQuery}&rdquo;</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Showing {products.length} live products with instant 30% savings applied.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed Lowest Price Procurement</span>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs animate-pulse space-y-4"
              >
                <div className="w-full h-56 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                <div className="pt-2 flex justify-between items-center">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Product Image Container */}
                <div className="relative w-full h-64 bg-slate-100 dark:bg-slate-800/50 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-12 h-12 stroke-1" />
                    </div>
                  )}

                  {/* 30% OFF Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md">
                    <Percent className="w-3 h-3" />
                    <span>~30% OFF</span>
                  </div>

                  {/* Article # Pill */}
                  <div className="absolute top-3 right-3 text-[11px] font-mono font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md backdrop-blur-xs border border-slate-200 dark:border-slate-700">
                    #{product.itemNo}
                  </div>
                </div>

                {/* Product Information Body */}
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Rating & Type */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {product.typeName || "IKEA Home"}
                      </span>
                      {product.rating !== null && (
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-slate-400 text-[11px]">({product.ratingCount})</span>
                        </div>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>

                    {/* Dimensions & Measure text */}
                    {product.itemMeasureReferenceText && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {product.itemMeasureReferenceText}
                      </p>
                    )}
                  </div>

                  {/* Pricing Box */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs text-slate-400 line-through">
                        IKEA: {product.formattedRetailPrice}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        Save {product.formattedSavings.replace("-", "")}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {product.formattedDiscountedPrice}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        (Quote price)
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <Button
                      type="button"
                      onClick={() => handleOpenQuoteModal(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-2.5 text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Get Quote &amp; Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>

                    <a
                      href={product.pipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 w-full py-1 text-center font-medium transition-colors"
                    >
                      <span>View on IKEA.com</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Quote / Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-200 font-bold">
                  Procurement Quote Request
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  Order {selectedProduct.name} (~30% OFF)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Submission Success State */}
              {submittedInquiryNumber ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                      Quote Request Confirmed!
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Our procurement team has received your inquiry and is verifying exact store stock and local logistics.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 inline-block font-mono">
                    <span className="text-xs text-slate-400 block font-sans">Inquiry Reference Code:</span>
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                      {submittedInquiryNumber}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    We will message or call you on <span className="font-semibold text-slate-800 dark:text-slate-200">{phoneNumber}</span> with exact delivery timing and confirmation.
                  </p>

                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl mt-4 cursor-pointer"
                  >
                    Done &amp; Continue Browsing
                  </Button>
                </div>
              ) : (
                /* Inquiry Form */
                <form onSubmit={handleSubmitQuote} className="space-y-5">
                  {/* Selected Product Summary Card */}
                  <div className="flex items-center gap-4 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="w-20 h-20 object-contain rounded-xl bg-white dark:bg-slate-900 border p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        #{selectedProduct.itemNo}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                        {selectedProduct.name} - {selectedProduct.typeName}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          {selectedProduct.formattedDiscountedPrice}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {selectedProduct.formattedRetailPrice}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          Save {selectedProduct.formattedSavings.replace("-", "")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fulfillment Method Selector */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Fulfillment Method
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setServiceType("DELIVERY")}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all cursor-pointer ${
                          serviceType === "DELIVERY"
                            ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400 shadow-xs"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        <span>Direct Delivery</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setServiceType("PICKUP")}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all cursor-pointer ${
                          serviceType === "PICKUP"
                            ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400 shadow-xs"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <Store className="w-4 h-4" />
                        <span>Store Pickup</span>
                      </button>
                    </div>
                  </div>

                  {/* Conditional Store or Delivery Location Input */}
                  {serviceType === "PICKUP" ? (
                    <div className="space-y-1.5">
                      <Label htmlFor="storeSelect" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Choose Pickup Store Location ({ikeaStores.length} Stores Available)
                      </Label>
                      <select
                        id="storeSelect"
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                      >
                        {ikeaStores.map((store) => (
                          <option key={store.id} value={`${store.name} (${store.city}, ${store.state})`}>
                            {store.name} - {store.city}, {store.state} ({store.zip})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="deliveryZip" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Delivery ZIP Code *
                        </Label>
                        <Input
                          id="deliveryZip"
                          required
                          value={deliveryZip}
                          onChange={(e) => setDeliveryZip(e.target.value)}
                          placeholder="e.g. 90210"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="deliveryAddress" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Street Address (Optional)
                        </Label>
                        <Input
                          id="deliveryAddress"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="e.g. 123 Main St, Apt 4"
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  )}

                  {/* Customer Contact Details */}
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Your Contact Details
                    </Label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="customerName" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Full Name *
                        </Label>
                        <Input
                          id="customerName"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Alex Morgan"
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phoneNumber" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          WhatsApp / Phone *
                        </Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Email Address (Optional)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="customerNotes" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Special Instructions / Color Preferences (Optional)
                      </Label>
                      <Input
                        id="customerNotes"
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder="e.g. Prefer dark gray color if available"
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-6 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Submitting Quote Request...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        <span>Request Official Discount Quote ({selectedProduct.formattedDiscountedPrice})</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
