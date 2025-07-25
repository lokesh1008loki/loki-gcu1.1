"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Confetti from "react-confetti";

// Add back countdown helpers above the component
function getCountdownTarget() {
  // Try to persist countdown across reloads using localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("nurse_offer_countdown_target");
    if (stored) return new Date(stored);
    const target = new Date(Date.now() + 12 * 60 * 60 * 1000);
    localStorage.setItem("nurse_offer_countdown_target", target.toISOString());
    return target;
  }
  return new Date(Date.now() + 12 * 60 * 60 * 1000);
}

function useCountdown(targetDate: Date | null): { hours: number; minutes: number; seconds: number; expired: boolean } {
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      setTimeLeft(targetDate.getTime() - new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  const hours = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((timeLeft / (1000 * 60)) % 60));
  const seconds = Math.max(0, Math.floor((timeLeft / 1000) % 60));
  return { hours, minutes, seconds, expired: timeLeft <= 0 };
}

// Helper to format phone number in US style
function formatUSPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 15);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6, 10)}`;
}

export default function NurseComfortOfferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const access = searchParams.get("access");

  useEffect(() => {
    if (access !== "comfort2024") {
      router.replace("/");
    }
  }, [access, router]);

  const [countdownTarget, setCountdownTarget] = useState<Date | null>(null);

  useEffect(() => {
    function getCountdownTarget() {
      const stored = localStorage.getItem("nurse_offer_countdown_target");
      if (stored) return new Date(stored);
      const target = new Date(Date.now() + 12 * 60 * 60 * 1000);
      localStorage.setItem("nurse_offer_countdown_target", target.toISOString());
      return target;
    }
    setCountdownTarget(getCountdownTarget());
  }, []);

  const { hours, minutes, seconds, expired } = useCountdown(countdownTarget);
  const [buttonShake, setButtonShake] = useState(false);
  const buttonRef = useRef(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [formGlow, setFormGlow] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const stateInputRef = useRef<HTMLInputElement | null>(null);
  const stateDropdownRef = useRef<HTMLUListElement | null>(null);
  const states = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
  ];
  const filteredStates = states.filter(s => s.label.toLowerCase().includes(stateSearch.toLowerCase()));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        stateInputRef.current &&
        !stateInputRef.current.contains(event.target as Node) &&
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStateDropdown(false);
      }
    }
    if (showStateDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStateDropdown]);

  // Button shake after 5s idle
  useEffect(() => {
    const timer = setTimeout(() => setButtonShake(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Reset shake on hover/click
  const handleButtonInteraction = () => setButtonShake(false);

  // Update CTA button click handler
  const handleCtaClick = () => {
    setButtonShake(false);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
      setFormGlow(true);
      setTimeout(() => setFormGlow(false), 1500);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Add form state for all fields
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    promo: "",
    help: "",
  });
  const [formErrors, setFormErrors] = useState<{ email?: string; phone?: string; help?: string }>({});
  const [showPopup, setShowPopup] = useState(false);

  // For confetti window size
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, [showPopup]);

  // Handle input changes
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (name === "help") {
      setFormFields(prev => ({ ...prev, help: value }));
    } else {
      setFormFields(prev => ({ ...prev, [name]: value }));
    }
  };

  // Update state selection
  useEffect(() => {
    // Find the full state name from the abbreviation
    const stateObj = states.find(s => s.value === selectedState);
    setFormFields(prev => ({ ...prev, state: stateObj ? stateObj.label : "" }));
  }, [selectedState]);

  // Validation helpers
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{8,15}$/.test(phone.replace(/\D/g, ""));

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submit
    setIsSubmitting(true);
    setShowSuccess(false);
    setFormErrors({});
    // Validate
    const errors: { email?: string; phone?: string; help?: string } = {};
    if (!validateEmail(formFields.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!validatePhone(formFields.phone)) {
      errors.phone = "Please enter a valid phone number (8-15 digits).";
    }
    if (!formFields.help) {
      errors.help = "Please select one option.";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }
    try {
      const submissionData = {
        ...formFields,
        timestamp: new Date().toISOString(),
      };
      await fetch("https://script.google.com/macros/s/AKfycbyJO54no4J-QzzZjICPCZptlvPD8TjAZES5IXzdrRBNFV4jHHxLFT3OMuuJSrxZzOIr3w/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      setShowSuccess(true);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000); // 5 seconds
      setFormFields({ name: "", email: "", phone: "", state: "", promo: "", help: "" });
      setStateSearch("");
      setSelectedState("");
    } catch (error) {
      // Optionally show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  if (access !== "comfort2024") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e6e6fa] via-blue-50 to-white flex flex-col items-center justify-center font-sans pb-32 md:pb-20">
      {/* Hero Section */}
      <section id="hero" className="w-full max-w-2xl py-14 px-4 text-center animate-fade-in relative overflow-hidden">
        {/* Animated motion background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg width="100%" height="100%" className="absolute animate-pulse opacity-30" style={{top:0,left:0}}>
            <defs>
              <radialGradient id="bg1" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#b3c6ff"/>
                <stop offset="100%" stopColor="#e6e6fa"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#bg1)"/>
          </svg>
        </div>
        <div className="relative z-10 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-blue-900 drop-shadow">Travel Nurses Deserve More Than Just a Paycheck.</h1>
          <h2 className="text-xl md:text-2xl font-medium text-blue-700 mb-6">Save 30–50% on Rent & Flights While You Serve on the Road.</h2>
          {/* Nurse Animation with floating effect */}
          <div className="h-40 w-full flex items-center justify-center bg-blue-100/60 rounded-lg mb-6 shadow-inner animate-float">
            <DotLottieReact
              src="https://lottie.host/ba3148e4-cbda-4dd7-9f1b-13e0269a15a9/yXFzt6wkke.lottie"
              loop
              autoplay
              style={{ width: 180, height: 140 }}
            />
          </div>
          {/* Countdown timer and CTA button with enhanced animation */}
          <button
            ref={buttonRef}
            className={`cta-animated bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all mt-4 ${buttonShake ? "animate-shake" : ""}`}
            onMouseEnter={handleButtonInteraction}
            onClick={handleCtaClick}
            disabled={expired}
          >
            {expired ? "Offer Expired" : "Claim My Comfort Deal – Offer Ends in 12 Hrs"}
            <span className="shine" />
          </button>
          {countdownTarget ? (
            <div className="mt-2 text-blue-800 font-mono text-lg">
              {expired ? "00:00:00" : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
            </div>
          ) : (
            <div className="mt-2 text-blue-800 font-mono text-lg">--:--:--</div>
          )}
          {expired && (
            <div className="mt-4 text-red-600 font-semibold animate-pulse">Sorry, this exclusive offer has ended.</div>
          )}
        </div>
      </section>
      {/* Emotional Story Section */}
      <section id="story" className="w-full max-w-3xl py-12 px-4">
        {/* Parallax scroll, before/after split, story text, visuals */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          {/* Parallax image */}
          <div className="w-full md:w-1/2 flex-shrink-0 parallax-image" style={{ perspective: 800 }}>
            <div className="transition-transform duration-700 will-change-transform" style={{ transform: 'translateY(var(--parallax, 0px))' }}>
              <Image
                src="/ass/Linkedin image add.png"
                alt="Nurse savings before and after"
                width={350}
                height={420}
                className="rounded-lg shadow-lg object-cover w-full h-auto"
                priority
              />
            </div>
          </div>
          {/* Story text */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="text-lg text-gray-700 font-medium mb-2">
              <span className="block mb-2">“Samantha, an ER travel nurse, broke down between shifts — not from the trauma of the ER, but the crushing weight of rent.”</span>
              <span className="block">“Then she found GoComfortUSA. Now her rent is slashed, her flights are locked in stress-free, and for once — her mind is finally at peace.”</span>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">Before</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">After</span>
            </div>
          </div>
        </div>
      </section>
      {/* Love + Fear Contrast Block */}
      <section id="love-fear" className="w-full max-w-3xl py-12 px-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-900">Your Compassion Shouldn’t Cost Your Comfort.</h3>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Fear Column */}
            <div className="flex-1 bg-red-50 rounded-lg p-4 flex flex-col items-center shadow-sm">
              <div className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">❌ Fear</div>
              <ul className="space-y-3 text-red-700 text-base font-medium">
                <li className="flex items-center gap-2 animate-bounce-slow">💸 <span>Constant rent anxiety</span></li>
                <li className="flex items-center gap-2 animate-bounce-slow delay-100">🏥 <span> Couch-hopping between contracts</span></li>
                <li className="flex items-center gap-2 animate-bounce-slow delay-200">✈️ <span>Booking last-minute overpriced flights</span></li>
                <li className="flex items-center gap-2 animate-bounce-slow delay-300">💰 <span>No one to call when plans fall apart</span></li>
              </ul>
            </div>
            {/* Love Column */}
            <div className="flex-1 bg-green-50 rounded-lg p-4 flex flex-col items-center shadow-sm">
              <div className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">✅ Love</div>
              <ul className="space-y-3 text-green-700 text-base font-medium">
                <li className="flex items-center gap-2 animate-bounce-slow">💚 <span>Instant 30–50% off </span></li>
                <li className="flex items-center gap-2 animate-bounce-slow delay-100">🛏️ <span>Verified furnished rentals</span></li>
                <li className="flex items-center gap-2 animate-bounce-slow delay-200">✈️ <span>Nurse-dedicated flight discounts</span></li>
                <li className="flex items-center gap-2 animate-bounce-slow delay-300">💬 <span>Real 1:1 human support (yes, even late night)</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Urgency Identity Block */}
      <section id="urgency" className="w-full max-w-2xl py-12 px-4 text-center">
        <div className="bg-blue-50 rounded-xl shadow p-6 flex flex-col items-center gap-4">
          <div className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">You care for strangers across states. We care that your rent doesn’t break you.</div>
          <div className="text-lg md:text-xl text-blue-700 mb-4">Because after every shift, you deserve more than just a place to sleep—you deserve peace.</div>
          <div className="flex flex-col items-center gap-2 mb-2">
            <span className="font-mono text-2xl text-green-700 bg-white px-4 py-2 rounded shadow flex items-center gap-2 justify-center">
              {expired ? "00:00:00" : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`} <span role="img" aria-label="hourglass">⏳</span>
            </span>
            {expired && (
              <span className="text-red-600 font-semibold animate-pulse">Sorry, this exclusive offer has ended.</span>
            )}
          </div>
          <button
            className={`cta-animated bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all mt-2 ${buttonShake ? "animate-shake" : ""}`}
            onMouseEnter={handleButtonInteraction}
            onClick={handleCtaClick}
            disabled={expired}
          >
            {expired ? "Offer Expired" : "Secure My Deal – 12 Hrs Left ⏳"}
            <span className="shine" />
          </button>
        </div>
      </section>
      {/* Slide-in Form Section */}
      <section id="form" className={`w-full max-w-md py-12 px-4${formGlow ? " animate-form-glow" : ""}`} ref={formRef}>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">Let’s Make You Comfortable.</h3>
          <div className="text-blue-700 mb-6">Fill out this short form to start your discount journey.</div>
          <form className="space-y-4 animate-fade-in" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-blue-900 mb-1">Name</label>
              <input type="text" id="name" name="name" required className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" value={formFields.name} onChange={handleFieldChange} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-1">Email</label>
              <input type="email" id="email" name="email" required className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" value={formFields.email} onChange={handleFieldChange} />
              {formErrors.email && <div className="text-red-600 text-xs mt-1">{formErrors.email}</div>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-blue-900 mb-1">Phone / WhatsApp</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={formatUSPhone(formFields.phone)}
                onChange={e => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 15);
                  setFormFields(prev => ({ ...prev, phone: digits }));
                }}
                maxLength={17}
              />
              {formErrors.phone && <div className="text-red-600 text-xs mt-1">{formErrors.phone}</div>}
            </div>
            {/* State selection and promo code remain as before, but state is synced to formFields */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-blue-900 mb-1">State</label>
              <input
                type="text"
                id="state-search"
                placeholder="Search state..."
                value={stateSearch}
                ref={stateInputRef}
                onChange={e => {
                  setStateSearch(e.target.value);
                  setShowStateDropdown(true);
                }}
                onFocus={() => setShowStateDropdown(true)}
                className="w-full rounded border px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                autoComplete="off"
              />
              <div className="relative">
                {showStateDropdown && (
                  <ul ref={stateDropdownRef} className="absolute z-10 w-full bg-white border rounded max-h-40 overflow-y-auto shadow">
                    {filteredStates.length === 0 && (
                      <li className="px-3 py-2 text-gray-400">No states found</li>
                    )}
                    {filteredStates.map(state => (
                      <li
                        key={state.value}
                        className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${selectedState === state.value ? "bg-blue-200 font-bold" : ""}`}
                        onClick={() => {
                          setSelectedState(state.value);
                          setStateSearch(state.label);
                          setShowStateDropdown(false);
                        }}
                      >
                        {state.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <input type="hidden" name="state" value={formFields.state} required />
            </div>
            <div>
              <label htmlFor="promo" className="block text-sm font-medium text-blue-900 mb-1">Promo Code (optional)</label>
              <input type="text" id="promo" name="promo" placeholder="Enter promo code if you have one" className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" value={formFields.promo} onChange={handleFieldChange} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="block text-sm font-medium text-blue-900 mb-1">Choose:</span>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="help" value="rent" className="accent-green-500" checked={formFields.help === "rent"} onChange={handleFieldChange} /> Rent Help
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="help" value="flight" className="accent-green-500" checked={formFields.help === "flight"} onChange={handleFieldChange} /> Flight Ticket
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="help" value="both" className="accent-green-500" checked={formFields.help === "both"} onChange={handleFieldChange} /> Both
              </label>
              {formErrors.help && <div className="text-red-600 text-xs mt-1">{formErrors.help}</div>}
            </div>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all animate-shake-idle" disabled={isSubmitting}>
              💌 Yes, I Need This
            </button>
            {showSuccess && (
              <div className="text-green-700 text-center mt-2 font-semibold">Thank you! Your request has been received. We will reach out to you on your given contact details within 24 hours.</div>
            )}
            <div className="text-xs text-gray-500 text-center mt-2">We’ll reach out within 24 hours on WhatsApp. No spam ever.</div>
            <div className="flex justify-center mt-4">
              <a
                href="mailto:support@gocomfortusa.com?subject=Travel%20Nurse%20Discount%20Query"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold shadow transition"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 4.99C2 3.89 2.89 3 4 3h16c1.1 0 2 .89 2 1.99v14.02A2 2 0 0 1 20 21H4c-1.1 0-2-.89-2-1.99V4.99zm2-.99v.01L12 13 20 4.01V4H4zm16 2.08l-7.58 7.58a1.003 1.003 0 0 1-1.42 0L4 6.08V19h16V6.08z"/></svg>
                Quick Email Query
              </a>
            </div>
          </form>
          {/* Popup notification */}
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={200} recycle={false} />
              <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg text-lg font-semibold animate-fade-in flex items-center gap-3">
                <span className="party-popper-emoji animate-party-pop" style={{ fontSize: 32 }}>🎉</span>
                Thanks for your interest! We will reach out within 24 hours.
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Sticky Trust Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 shadow-inner py-3 px-4 flex flex-col items-center z-50">
        <div className="w-full max-w-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Mini-carousel of trust logos */}
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
            <Image src="/bbb.png" alt="BBB Accredited" width={60} height={30} className="object-contain" />
            <Image src="/Trustpilot Stars.png" alt="Trustpilot Stars" width={90} height={30} className="object-contain" />
            <Image src="/google reviews.png" alt="Google Reviews" width={90} height={30} className="object-contain" />
            <Image src="/site jabber.png" alt="Site Jabber" width={70} height={30} className="object-contain" />
          </div>
          {/* Trust text and WhatsApp CTA */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="text-xs text-gray-700 font-semibold">500+ Travel Nurses Served | HIPAA Secure </div>
            <a
              href="https://wa.me/18125528038"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs font-bold shadow transition"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.19-1.62A12.07 12.07 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.25-1.44l-.38-.22-3.68.97.98-3.59-.25-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.28-.97.95-.97 2.3 0 1.35.99 2.65 1.13 2.83.14.18 1.95 2.98 4.74 4.06.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z"/></svg>
              Got a quick question? WhatsApp us
            </a>
          </div>
        </div>
      </footer>
      {/* Move global styles here to fix build error */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in { animation: fadeIn 1.2s cubic-bezier(.4,0,.2,1) both; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.7s; }
        .parallax-image { will-change: transform; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.2s infinite; }
        .animate-bounce-slow.delay-100 { animation-delay: 0.1s; }
        .animate-bounce-slow.delay-200 { animation-delay: 0.2s; }
        .animate-bounce-slow.delay-300 { animation-delay: 0.3s; }
        /* Floating animation for nurse */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 3.2s ease-in-out infinite; }
        /* CTA button glowing pulse */
        .cta-animated {
          position: relative;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7), 0 2px 8px rgba(0,0,0,0.08);
          animation: cta-pulse 2.2s infinite;
          overflow: hidden;
        }
        @keyframes cta-pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7), 0 2px 8px rgba(0,0,0,0.08); }
          70% { box-shadow: 0 0 0 12px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7), 0 2px 8px rgba(0,0,0,0.08); }
        }
        .cta-animated:hover {
          transform: scale(1.04) translateY(-2px);
          box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.15), 0 4px 16px rgba(0,0,0,0.12);
        }
        /* Shine effect on CTA */
        .cta-animated .shine {
          content: '';
          position: absolute;
          top: 0; left: -75%;
          width: 50%; height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.2) 100%);
          transform: skewX(-20deg);
          pointer-events: none;
          animation: shine-move 2.8s infinite;
        }
        @keyframes shine-move {
          0% { left: -75%; }
          60% { left: 120%; }
          100% { left: 120%; }
        }
        @keyframes form-glow {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50% { box-shadow: 0 0 24px 8px rgba(34,197,94,0.25); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
        }
        .animate-form-glow > div {
          animation: form-glow 1.5s ease-in-out;
        }
        /* Custom animated scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
          background: #f3f6fd;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(120deg, #b3c6ff 40%, #a7e3e3 100%);
          border-radius: 8px;
          transition: background 0.3s;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(120deg, #7faaff 40%, #5eead4 100%);
        }
        ::-webkit-scrollbar-track {
          background: #f3f6fd;
        }
        /* For Firefox */
        html {
          scrollbar-width: thin;
          scrollbar-color: #b3c6ff #f3f6fd;
        }
        /* Animate thumb on scroll (subtle pulse) */
        ::-webkit-scrollbar-thumb {
          animation: scrollbar-pulse 2.5s infinite;
        }
        @keyframes scrollbar-pulse {
          0%, 100% { box-shadow: 0 0 0 0 #a7e3e3; }
          50% { box-shadow: 0 0 8px 2px #a7e3e3; }
        }
        @keyframes party-pop {
          0% { transform: scale(0.7) rotate(-20deg); opacity: 0; }
          20% { transform: scale(1.2) rotate(10deg); opacity: 1; }
          40% { transform: scale(1.1) rotate(-10deg); }
          60% { transform: scale(1.2) rotate(10deg); }
          80% { transform: scale(1) rotate(0deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-party-pop { animation: party-pop 1.2s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </main>
  );
} 