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
      itemNumber,
      productName,
      productType,
      productUrl,
      imageUrl,
      ikeaPrice,
      discountPercent = 30,
      quotePrice,
      serviceType = "DELIVERY",
      storeLocation,
      deliveryZip,
      deliveryAddress,
      customerNotes,
    } = body;

    // Validation
    if (!customerName || !customerName.trim()) {
      return NextResponse.json(
        { error: "Customer name is required." },
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

    if (!itemNumber || !productName) {
      return NextResponse.json(
        { error: "Product information is required." },
        { status: 400 }
      );
    }

    // Generate readable inquiry tracking code e.g. GCU-IK-84920
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const inquiryNumber = `GCU-IK-${randomDigits}`;

    const inquiry = await prisma.ikeaInquiry.create({
      data: {
        inquiryNumber,
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email?.trim() || null,
        itemNumber: String(itemNumber),
        productName: productName.trim(),
        productType: productType?.trim() || null,
        productUrl: productUrl || null,
        imageUrl: imageUrl || null,
        ikeaPrice: Number(ikeaPrice) || 0,
        discountPercent: Number(discountPercent) || 30,
        quotePrice: Number(quotePrice) || 0,
        serviceType: serviceType === "PICKUP" ? "PICKUP" : "DELIVERY",
        storeLocation: storeLocation || null,
        deliveryZip: deliveryZip || null,
        deliveryAddress: deliveryAddress || null,
        customerNotes: customerNotes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      inquiryNumber: inquiry.inquiryNumber,
      message: "IKEA order quote inquiry received successfully!",
      inquiry,
    });
  } catch (error: any) {
    console.error("IKEA inquiry submission error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit quote inquiry. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const inquiries = await prisma.ikeaInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error: any) {
    console.error("Error fetching IKEA inquiries:", error);
    return NextResponse.json(
      { error: "Failed to retrieve inquiries." },
      { status: 500 }
    );
  }
}

