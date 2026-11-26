import React from "react"
import { ServiceFaqItem } from "@/lib/service-faqs"

export function ServiceFaqSection({
  title = "Frequently Asked Questions",
  faqs,
}: {
  title?: string
  faqs: ServiceFaqItem[]
}) {
  return (
    <section className="mt-14 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs"
          >
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {faq.question}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
