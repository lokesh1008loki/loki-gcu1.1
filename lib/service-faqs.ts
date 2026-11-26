export interface ServiceFaqItem {
  question: string
  answer: string
}

export const CANONICAL_BUSINESS_DESCRIPTION =
  "GoComfortUSA is a US travel consultation service. It helps customers across the United States find and compare domestic flights, compare US hotels by their true total price, and order IKEA products with delivery by IKEA. GoComfortUSA is a research and ordering-assistance service — it is not an airline, a hotel, or IKEA; customers book flights and hotels with the official providers. For Disneyland (Anaheim, California) tickets, GoComfortUSA provides booking assistance through an authorized supplier. The service advertises savings of up to 30% off and serves the USA only."

export const FLIGHT_FAQS: ServiceFaqItem[] = [
  {
    question: "Does GoComfortUSA sell airline tickets directly?",
    answer:
      "No. GoComfortUSA is a US travel consultation and flight research service, not an airline. We help you find and compare domestic US flights, and you book directly with the official airline or provider.",
  },
  {
    question: "Who is GoComfortUSA flight research for?",
    answer:
      "The service is for customers across the United States looking for help comparing domestic US flight routes, schedules, and total trip costs, including savings of up to 30% off eligible fares.",
  },
  {
    question: "How does the flight search and custom route inquiry work?",
    answer:
      "You can search live domestic flight options on this page or submit a custom route inquiry with your departure city, destination, dates, passenger count, and cabin class. Our specialists review your itinerary and follow up via WhatsApp, Telegram, or email.",
  },
  {
    question: "Can I request round-trip or multi-passenger domestic itineraries?",
    answer:
      "Yes. Both the live flight search and custom route inquiry form support one-way and round-trip domestic US itineraries, multiple passengers, and Economy, Premium Economy, Business, or First Class cabin preferences.",
  },
]

export const HOTEL_FAQS: ServiceFaqItem[] = [
  {
    question: "Does GoComfortUSA operate or sell hotel rooms directly?",
    answer:
      "No. GoComfortUSA is a US travel consultation and hotel research service, not a hotel. We help customers compare US hotels by their true total price, and customers book with the official providers.",
  },
  {
    question: "What does comparing hotels by true total price mean?",
    answer:
      "A nightly headline rate often excludes mandatory resort fees, destination fees, and taxes. GoComfortUSA compares the whole-stay total for your dates and guest count so you see the full cost upfront, with advertised savings of up to 30% off.",
  },
  {
    question: "How do I request a hotel quote for my US trip?",
    answer:
      "Enter your destination city, check-in and check-out dates, and number of guests and rooms to search available properties, then submit a quote request with your contact details and room preference for follow-up from a specialist.",
  },
  {
    question: "Which destinations does GoComfortUSA hotel research cover?",
    answer:
      "GoComfortUSA serves the USA only and helps compare hotels across major US destinations including Miami Beach, Orlando, Las Vegas, New York City, Los Angeles, and Hawaii.",
  },
]

export const IKEA_FAQS: ServiceFaqItem[] = [
  {
    question: "Is GoComfortUSA affiliated with or operated by IKEA?",
    answer:
      "No. GoComfortUSA is an independent US consultation and ordering-assistance service, not IKEA. We help customers across the United States choose and order IKEA products, with delivery by IKEA.",
  },
  {
    question: "How does IKEA ordering assistance work?",
    answer:
      "Search the live IKEA US product catalog on this page, select the product you want, choose direct delivery by IKEA or store pickup from a US IKEA store, and submit a quote request with your ZIP code or store preference.",
  },
  {
    question: "How much can I save on IKEA orders?",
    answer:
      "GoComfortUSA advertises savings of up to 30% off IKEA products across the United States. After you submit a quote request, our team confirms stock and total pricing before you proceed.",
  },
  {
    question: "Who delivers my IKEA order?",
    answer:
      "Delivery is handled by IKEA for eligible US delivery ZIP codes, or you can choose store pickup at a participating US IKEA store location.",
  },
]

export const DISNEYLAND_FAQS: ServiceFaqItem[] = [
  {
    question: "Is GoComfortUSA Disney or an authorized ticket seller?",
    answer:
      "No. GoComfortUSA is an independent US travel consultation service — it is not Disney and is not an authorized seller itself. For Disneyland (Anaheim, California) tickets, GoComfortUSA provides booking assistance through an authorized supplier.",
  },
  {
    question: "Do I need a park reservation in addition to a Disneyland ticket?",
    answer:
      "Yes. Both a valid admission ticket and a theme park reservation for the same park and date are required for entry to Disneyland Park or Disney California Adventure Park, along with a Disney account.",
  },
  {
    question: "Are Lightning Lane options available for Disneyland?",
    answer:
      "Yes. Disneyland offers Lightning Lane Multi Pass and Lightning Lane Single Pass for faster entry on select attractions. You can note Lightning Lane interest in your ticket request form and our team will include guidance for your visit date.",
  },
  {
    question: "Which Disneyland parks can I request booking assistance for?",
    answer:
      "You can request booking assistance for Disneyland Park, Disney California Adventure Park, or a Park Hopper ticket to visit both Anaheim parks on the same day, plus optional parking or seasonal event access.",
  },
]

export const ABOUT_FAQS: ServiceFaqItem[] = [
  {
    question: "What is GoComfortUSA?",
    answer:
      "GoComfortUSA is a US travel consultation service. It helps customers across the United States find and compare domestic flights, compare US hotels by their true total price, and order IKEA products with delivery by IKEA.",
  },
  {
    question: "Is GoComfortUSA an airline, hotel, IKEA, or Disney?",
    answer:
      "No. GoComfortUSA is a research and ordering-assistance service — it is not an airline, a hotel, or IKEA; customers book flights and hotels with the official providers. For Disneyland (Anaheim, California) tickets, GoComfortUSA provides booking assistance through an authorized supplier.",
  },
  {
    question: "Where does GoComfortUSA operate and what savings are advertised?",
    answer:
      "GoComfortUSA serves the USA only and advertises savings of up to 30% off eligible services.",
  },
  {
    question: "How can I contact GoComfortUSA for support?",
    answer:
      "You can reach GoComfortUSA by email at support@gocomfortusa.com, via our contact page, or on WhatsApp for assistance with flights, hotels, IKEA orders, and Disneyland tickets.",
  },
]
