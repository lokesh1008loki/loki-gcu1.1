import React from "react"
import Image from "next/image"
import { AlertCircle, Clock, Info } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Southwest",
  description: "Official Service Alert: Unexpected Technical Glitch Disrupts Travel Plans at Southwest Airlines",
}

export default function SouthwestGlitchNoticePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-[#003594] selection:text-white">
      {/* Official Alert Banner */}
      <div className="bg-[#EE1C25] text-white py-3 px-4 text-center text-sm font-bold tracking-widest uppercase animate-in fade-in duration-700">
        <span className="flex items-center justify-center gap-2">
          <AlertCircle className="h-4 w-4" /> Official Service Alert: Technical Disruption
        </span>
      </div>

      <main className="container mx-auto px-6 py-16 md:py-24 max-w-4xl space-y-16">
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="relative h-20 w-64 md:h-24 md:w-80">
            <Image 
              src="/icons/southwest_air.png" 
              alt="Southwest Airlines" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Unexpected Technical Glitch Disrupts Travel Plans
            </h1>
            <div className="flex items-center justify-center gap-4 text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> April 3, 2026</span>
              <span className="h-1 w-1 bg-slate-300 rounded-full" />
              <span className="flex items-center gap-1.5"><Info className="h-4 w-4" /> System Status Update</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <p className="text-xl md:text-2xl leading-relaxed text-slate-700 dark:text-slate-300 font-medium border-l-4 border-[#003594] pl-6 py-2">
            On April 3, 2026, a significant technical glitch in the server systems of Southwest Airlines caused widespread disruption for passengers across multiple airports. The unexpected issue impacted the airline’s booking and boarding systems, leaving many travelers stranded and uncertain about their journeys.
          </p>

          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            According to initial reports, the server malfunction led to the automatic cancellation of approximately 1,000+ booked tickets. Passengers who had already checked in or were preparing to board suddenly found their reservations invalid due to the system error. This created confusion at airport terminals, with long queues forming at customer service counters as travelers sought clarification and assistance.
          </p>

          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            The glitch appears to have affected real-time synchronization between ticketing and boarding systems, which is crucial for verifying passenger eligibility. As a result, even valid bookings were mistakenly flagged and canceled by the system.
          </p>

          <div className="relative group p-10 rounded-[32px] overflow-hidden">
            <div className="absolute inset-0 bg-[#003594] opacity-[0.03] dark:opacity-[0.07] group-hover:opacity-[0.05] transition-opacity duration-500" />
            <div className="absolute top-0 left-0 w-2 h-full bg-[#003594]" />
            <blockquote className="relative text-2xl md:text-3xl font-bold tracking-tight text-[#003594] dark:text-blue-400 leading-tight italic border-0 p-0 m-0">
              “We sincerely apologize to all passengers affected by today’s technical issue. We understand how frustrating and stressful this situation is, and our teams are working urgently to resolve the problem and assist impacted customers.”
            </blockquote>
          </div>

          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Efforts are currently underway to rebook affected passengers, provide accommodations where necessary, and ensure that operations return to normal as quickly as possible. Additional staff have been deployed at major airports to help manage the situation and support travelers.
          </p>

          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            Incidents like these highlight the growing dependence on digital infrastructure in the aviation industry. While technology enhances efficiency, unexpected failures can have large-scale consequences.
          </p>

          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Passengers are advised to check their flight status regularly and stay in contact with airline representatives for updates. Southwest Airlines has also encouraged affected customers to reach out through their official support channels for rebooking and compensation options.
          </p>

          <div className="pt-12 border-t border-slate-100 dark:border-slate-800 text-center space-y-6">
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              Once again, the airline extends its heartfelt apology and assures passengers that measures will be taken to prevent such incidents in the future.
            </p>
            <p className="text-2xl font-black text-[#003594] dark:text-blue-400 bg-[#003594]/5 dark:bg-blue-400/10 inline-block px-8 py-4 rounded-2xl">
              We sincerely apologize for the inconvenience caused and appreciate your patience and understanding during this time.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
