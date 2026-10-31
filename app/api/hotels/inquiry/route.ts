import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customerName,
      phoneNumber,
      email,
      hotelName,
      hotelUrl,
      imageUrl,
      location,
      checkInDate,
      checkOutDate,
      numberOfNights = 1,
      numberOfRooms = 1,
      numberOfAdults = 2,
      numberOfChildren = 0,
      roomType,
      retailPrice,
      discountPercent = 30,
      quotePrice,
      specialRequests,
    } = body;

    // Validation
    if (!customerName || !customerName.trim()) {
      return NextResponse.json(
        { error: "Guest name is required." },
        { status: 400 }
      );
    }

    const cleanPhone = (phoneNumber || "").replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "A valid phone or WhatsApp number with at least 10 digits is required." },
        { status: 400 }
      );
    }

    if (!hotelName) {
      return NextResponse.json(
        { error: "Hotel information is required." },
        { status: 400 }
      );
    }

    if (!checkInDate || !checkOutDate) {
      return NextResponse.json(
        { error: "Check-in and Check-out dates are required." },
        { status: 400 }
      );
    }

    // Generate readable inquiry tracking code e.g. GCU-HT-48201
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const inquiryNumber = `GCU-HT-${randomDigits}`;

    const inquiry = await prisma.hotelInquiry.create({
      data: {
        inquiryNumber,
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email?.trim() || null,
        hotelName: hotelName.trim(),
        hotelUrl: hotelUrl || null,
        imageUrl: imageUrl || null,
        location: location || null,
        checkInDate: String(checkInDate),
        checkOutDate: String(checkOutDate),
        numberOfNights: Number(numberOfNights) || 1,
        numberOfRooms: Number(numberOfRooms) || 1,
        numberOfAdults: Number(numberOfAdults) || 2,
        numberOfChildren: Number(numberOfChildren) || 0,
        roomType: roomType || null,
        retailPrice: Number(retailPrice) || 0,
        discountPercent: Number(discountPercent) || 30,
        quotePrice: Number(quotePrice) || 0,
        specialRequests: specialRequests || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      inquiryNumber: inquiry.inquiryNumber,
      message: "Hotel booking quote inquiry received successfully!",
      inquiry,
    });
  } catch (error: any) {
    console.error("Hotel inquiry submission error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit hotel quote request. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const inquiries = await prisma.hotelInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error: any) {
    console.error("Fetch hotel inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel inquiries", details: error?.message },
      { status: 500 }
    );
  }
}

