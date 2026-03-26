import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, CreditCard, Send, Calendar, Ticket } from "lucide-react"

export default function HowWeWork() {
  const steps = [
    {
      icon: <Send className="h-10 w-10 text-primary" />,
      title: "Submit Details",
      description:
        "Provide your travel dates, preferred destinations, and specific needs for flights and hotel stays.",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Expert Analysis",
      description:
        "Our team analyzes your requirements to find the most optimized routes and premium stay options.",
    },
    {
      icon: <Ticket className="h-10 w-10 text-primary" />,
      title: "Book & Travel",
      description: "Review your personalized options and book yourself or request our optional assistance.",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Work</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience a seamless travel planning journey with GoComfortUSA. Our professional consultants
            handle the research and optimization, so you can focus on the trip itself.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
