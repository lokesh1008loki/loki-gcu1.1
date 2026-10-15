import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    // Optional check: if session is required in production
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { inquiryNumber: { contains: search, mode: "insensitive" } },
        { contactFirstName: { contains: search, mode: "insensitive" } },
        { contactLastName: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { origin: { contains: search, mode: "insensitive" } },
        { destination: { contains: search, mode: "insensitive" } },
        { selectedAirline: { contains: search, mode: "insensitive" } },
      ];
    }

    const inquiries = await prisma.flightInquiry.findMany({
      where,
      include: {
        passengers: {
          orderBy: { passengerIndex: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ inquiries });
  } catch (error: any) {
    console.error("Failed to load flight inquiries:", error);
    return NextResponse.json(
      { error: "Failed to load flight inquiries", message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing inquiry id" }, { status: 400 });
    }

    const data: any = {};
    if (status) data.status = status;
    if (adminNotes !== undefined) data.adminNotes = adminNotes;

    const updated = await prisma.flightInquiry.update({
      where: { id },
      data,
      include: { passengers: true },
    });

    return NextResponse.json({ inquiry: updated });
  } catch (error: any) {
    console.error("Failed to update flight inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update flight inquiry", message: error.message },
      { status: 500 }
    );
  }
}
