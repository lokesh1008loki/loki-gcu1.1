import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`${clientIp}:flights-inquiry`, 15, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many flight inquiries submitted. Rate limit is 15 requests per minute. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfterSeconds),
            "X-RateLimit-Limit": "15",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

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
      returnAirline,
      returnFlightNumber,
      returnDepartureTime,
      returnArrivalTime,
      returnOrigin,
      returnDestination,
      returnDuration,
      returnStops,
      flightData,
    } = body;

    // 1. Validate Primary Contact First and Last Names
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!contactFirstName || !contactFirstName.trim()) {
      return NextResponse.json({ error: "Contact First Name is required." }, { status: 400 });
    }
    if (contactFirstName.trim().length < 2) {
      return NextResponse.json({ error: "Contact First Name must be at least 2 characters." }, { status: 400 });
    }
    if (!nameRegex.test(contactFirstName.trim())) {
      return NextResponse.json({ error: "Contact First Name can only contain letters, spaces, or hyphens." }, { status: 400 });
    }

    if (!contactLastName || !contactLastName.trim()) {
      return NextResponse.json({ error: "Contact Last Name is required." }, { status: 400 });
    }
    if (contactLastName.trim().length < 2) {
      return NextResponse.json({ error: "Contact Last Name must be at least 2 characters." }, { status: 400 });
    }
    if (!nameRegex.test(contactLastName.trim())) {
      return NextResponse.json({ error: "Contact Last Name can only contain letters, spaces, or hyphens." }, { status: 400 });
    }

    // 2. Validate WhatsApp / Phone Number (10 to 15 numeric digits, no obvious dummy sequences)
    const phoneTrimmed = (phoneNumber || "").trim();
    const phoneDigits = phoneTrimmed.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 10 || phoneDigits.length > 15) {
      return NextResponse.json(
        { error: "Please enter a valid phone or WhatsApp number (10 to 15 digits)." },
        { status: 400 }
      );
    }
    const fakeSequences = ["0000000000", "1111111111", "2222222222", "3333333333", "4444444444", "5555555555", "1234567890"];
    if (fakeSequences.some((seq) => phoneDigits.includes(seq))) {
      return NextResponse.json(
        { error: "Please enter a real, active mobile or WhatsApp phone number." },
        { status: 400 }
      );
    }

    // 3. Validate Email Address (Optional, but if supplied must be a valid RFC format)
    if (email && email.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: "Please enter a valid email address (e.g. name@domain.com)." },
          { status: 400 }
        );
      }
    }

    // 4. Validate Traveler Identification & Passenger List
    if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return NextResponse.json(
        { error: "At least one traveler's information is required." },
        { status: 400 }
      );
    }

    const today = new Date();
    for (const [index, p] of passengers.entries()) {
      const pNum = index + 1;
      const fullName = (p.fullNameAsPerId || "").trim();
      
      // Full Legal Name validation (minimum 2 words: First + Last Name as required by airlines)
      if (!fullName || fullName.length < 3) {
        return NextResponse.json(
          { error: `Traveler #${pNum}: Please enter full legal name as printed on Valid Government ID.` },
          { status: 400 }
        );
      }
      if (!nameRegex.test(fullName)) {
        return NextResponse.json(
          { error: `Traveler #${pNum} (${fullName}): Name can only contain letters, spaces, hyphens, or apostrophes.` },
          { status: 400 }
        );
      }
      const nameParts = fullName.split(/\s+/).filter(Boolean);
      if (nameParts.length < 2) {
        return NextResponse.json(
          { error: `Traveler #${pNum} (${fullName}): Airlines require both First and Last Name as shown on Valid ID.` },
          { status: 400 }
        );
      }

      // Date of Birth format & calendar calendar day validation (MM/DD/YYYY)
      const dobStr = (p.dob || "").trim();
      const dobMatch = dobStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (!dobMatch) {
        return NextResponse.json(
          { error: `Traveler #${pNum} (${fullName}): DOB must be in valid MM/DD/YYYY format (e.g. 10/14/1989).` },
          { status: 400 }
        );
      }
      const mm = parseInt(dobMatch[1], 10);
      const dd = parseInt(dobMatch[2], 10);
      const yyyy = parseInt(dobMatch[3], 10);

      if (mm < 1 || mm > 12) {
        return NextResponse.json(
          { error: `Traveler #${pNum} (${fullName}): Invalid birth month (${mm}). Must be between 01 and 12.` },
          { status: 400 }
        );
      }
      const daysInMonth = new Date(yyyy, mm, 0).getDate();
      if (dd < 1 || dd > daysInMonth) {
        return NextResponse.json(
          { error: `Traveler #${pNum} (${fullName}): Invalid day (${dd}) for month ${mm}. Maximum days is ${daysInMonth}.` },
          { status: 400 }
        );
      }
      if (yyyy < 1905 || yyyy > today.getFullYear()) {
        return NextResponse.json(
          { error: `Traveler #${pNum} (${fullName}): Birth year must be between 1905 and ${today.getFullYear()}.` },
          { status: 400 }
        );
      }

      const birthDate = new Date(yyyy, mm - 1, dd);
      if (birthDate > today) {
        return NextResponse.json(
          { error: `Traveler #${pNum} (${fullName}): Date of birth cannot be in the future.` },
          { status: 400 }
        );
      }

      // Exact age calculation
      let age = today.getFullYear() - birthDate.getFullYear();
      const mDiff = today.getMonth() - birthDate.getMonth();
      if (mDiff < 0 || (mDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      // Age category check: ADULT must be 18+, CHILD must be 0-17
      if (p.passengerType === "ADULT") {
        if (age < 18) {
          return NextResponse.json(
            { error: `Traveler #${pNum} (${fullName}): Booked as an Adult (18+), but date of birth indicates age ${age}. Adults must be at least 18 years old.` },
            { status: 400 }
          );
        }
      } else if (p.passengerType === "CHILD") {
        if (age < 0 || age > 17) {
          return NextResponse.json(
            { error: `Traveler #${pNum} (${fullName}): Booked as a Child (0-17), but date of birth indicates age ${age}. Children must be 17 or younger.` },
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
        returnDate: tripType === "ROUNDTRIP" ? (returnDate || null) : null,
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
        returnAirline: tripType === "ROUNDTRIP" ? (returnAirline || selectedAirline || null) : null,
        returnFlightNumber: tripType === "ROUNDTRIP" ? (returnFlightNumber || null) : null,
        returnDepartureTime: tripType === "ROUNDTRIP" ? (returnDepartureTime || null) : null,
        returnArrivalTime: tripType === "ROUNDTRIP" ? (returnArrivalTime || null) : null,
        returnOrigin: tripType === "ROUNDTRIP" ? (returnOrigin || destination || null) : null,
        returnDestination: tripType === "ROUNDTRIP" ? (returnDestination || origin || null) : null,
        returnDuration: tripType === "ROUNDTRIP" ? (returnDuration || null) : null,
        returnStops: tripType === "ROUNDTRIP" ? (returnStops || "Direct") : null,
        flightData: typeof flightData === "object" ? JSON.stringify(flightData) : (flightData || null),
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
