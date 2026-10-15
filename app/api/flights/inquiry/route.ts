import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      contactFirstName,
      contactLastName,
      phoneNumber,
      email,
      origin,
      destination,
      departDate,
      returnDate,
      tripType,
      cabinClass,
      totalPassengers,
      adults,
      children,
      quoteId,
      selectedAirline,
      flightNumber,
      departureTime,
      arrivalTime,
      duration,
      stops,
      baggage,
      scrapedBaseFare,
      regularMarketFare,
      discountPercent,
      finalFarePerPerson,
      totalPrice,
      passengers,
      customerNotes,
    } = body;

    // Basic Validation
    if (!contactFirstName || !contactLastName || !phoneNumber) {
      return NextResponse.json(
        { error: "Contact name and phone number are required." },
        { status: 400 }
      );
    }

    if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return NextResponse.json(
        { error: "At least one traveler's information is required." },
        { status: 400 }
      );
    }

    // Validate DOB format (MM/DD/YYYY) for each passenger
    const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;
    for (const [index, p] of passengers.entries()) {
      if (!p.fullNameAsPerId || p.fullNameAsPerId.trim().length < 2) {
        return NextResponse.json(
          { error: `Traveler #${index + 1}: Please enter full name as per Valid ID.` },
          { status: 400 }
        );
      }
      if (!p.dob || !dobRegex.test(p.dob.trim())) {
        return NextResponse.json(
          { error: `Traveler #${index + 1} (${p.fullNameAsPerId}): DOB must be in valid MM/DD/YYYY format.` },
          { status: 400 }
        );
      }
      if (p.passengerType === "CHILD") {
        const age = Number(p.childAge)
        if (p.childAge === null || p.childAge === undefined || !Number.isInteger(age) || age < 0 || age > 17) {
          return NextResponse.json(
            { error: `Traveler #${index + 1} (${p.fullNameAsPerId}): child age must be between 0 and 17.` },
            { status: 400 }
          );
        }
      }
    }

    // Generate unique human-friendly inquiry reference (e.g. GCU-FL-83921)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const inquiryNumber = `GCU-FL-${randomSuffix}`;

    // Create inquiry with nested passengers in Prisma
    const inquiry = await prisma.flightInquiry.create({
      data: {
        inquiryNumber,
        contactFirstName: contactFirstName.trim(),
        contactLastName: contactLastName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email ? email.trim() : null,
        origin: origin || "N/A",
        destination: destination || "N/A",
        departDate: departDate || "N/A",
        returnDate: returnDate || null,
        tripType: tripType || "ONEWAY",
        cabinClass: cabinClass || "ECONOMY",
        totalPassengers: Number(totalPassengers) || passengers.length,
        adults: Number(adults) || passengers.filter((p: any) => p.passengerType !== "CHILD").length || 1,
        children: Number(children) || passengers.filter((p: any) => p.passengerType === "CHILD").length,
        quoteId: quoteId ? String(quoteId) : null,
        selectedAirline: selectedAirline || "Flight Option",
        flightNumber: flightNumber || null,
        departureTime: departureTime || null,
        arrivalTime: arrivalTime || null,
        duration: duration || null,
        stops: stops || "Direct",
        baggage: baggage || null,
        scrapedBaseFare: parseFloat(scrapedBaseFare) || 0,
        regularMarketFare: parseFloat(regularMarketFare) || 0,
        discountPercent: Number(discountPercent) || 30,
        finalFarePerPerson: parseFloat(finalFarePerPerson) || 0,
        totalPrice: parseFloat(totalPrice) || 0,
        currency: "USD",
        status: "PENDING",
        customerNotes: customerNotes ? customerNotes.trim() : null,
        passengers: {
          create: passengers.map((p: any, idx: number) => ({
            passengerIndex: idx + 1,
            passengerType: p.passengerType || "ADULT",
            fullNameAsPerId: p.fullNameAsPerId.trim(),
            dob: p.dob.trim(),
            gender: (p.gender || "MALE").toUpperCase(),
            childAge: p.passengerType === "CHILD" && Number.isInteger(Number(p.childAge)) ? Number(p.childAge) : null,
          })),
        },
      },
      include: {
        passengers: true,
      },
    });

    // Notify scraper backend to record inquiry linkage for this quoteId (non-blocking)
    if (inquiry.quoteId) {
      try {
        const scraperUrl = process.env.SCRAPER_API_URL || "http://127.0.0.1:5001";
        fetch(`${scraperUrl}/api/quotations/${encodeURIComponent(inquiry.quoteId)}/inquiry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inquiryId: inquiry.id,
            inquiryNumber: inquiry.inquiryNumber,
            totalPrice: inquiry.totalPrice,
            passengersCount: inquiry.totalPassengers,
            currency: inquiry.currency,
            status: inquiry.status
          }),
        }).catch((err) => {
          // Log only, do not block customer inquiry
          console.warn("[GCU Flight Inquiry] Scraper notification skipped:", err?.message || err);
        });
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      inquiryNumber: inquiry.inquiryNumber,
      inquiryId: inquiry.id,
      totalPrice: inquiry.totalPrice,
      message: "Flight inquiry created successfully!",
    });
  } catch (error: any) {
    console.error("Prisma flight inquiry error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit flight inquiry." },
      { status: 500 }
    );
  }
}
