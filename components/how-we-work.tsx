import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, CreditCard, Send, Calendar, Ticket } from "lucide-react"

export default function HowWeWork() {
  const steps = [
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Choose Your Service",
      description:
        "Browse through our wide range of services including park tickets, bill payments, travel bookings, and more.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Make Your Booking",
      description:
        "Fill out the booking form with your details and preferences. All payments are secure and encrypted.",
    },
    {
      icon: <Send className="h-10 w-10 text-primary" />,
      title: "Receive Confirmation",
      description: "Get instant confirmation of your booking via email and WhatsApp with all the details.",
    },
    {
      icon: <Ticket className="h-10 w-10 text-primary" />,
      title: "Get Your Tickets",
      description: "Your tickets or booking confirmations will be sent directly to your WhatsApp for easy access.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Enjoy Your Experience",
      description: "Show up at the venue on your scheduled date and time, present your ticket, and enjoy!",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Work</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
          Our dedicated team consistently scours the web to discover the best deals, offers, and coupons. We automatically 
          apply these savings to the services you choose, ensuring you get maximum value without the hassle. We've also 
          partnered with numerous trusted companies to unlock exclusive discounts—allowing us to provide high-quality services 
          at the most affordable rates, with minimal impact on your budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
