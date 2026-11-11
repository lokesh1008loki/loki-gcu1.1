import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET all IKEA inquiries for Admin dashboard
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inquiries = await prisma.ikeaInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      inquiries,
      count: inquiries.length,
    });
  } catch (error: any) {
    console.error("Admin fetch IKEA inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch IKEA inquiries", details: error?.message },
      { status: 500 }
    );
  }
}

// PATCH update status or notes for an inquiry
export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, customerNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 });
    }

    const updated = await prisma.ikeaInquiry.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(customerNotes !== undefined ? { customerNotes } : {}),
      },
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error: any) {
    console.error("Admin update IKEA inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry", details: error?.message },
      { status: 500 }
    );
  }
}

// DELETE an inquiry (supports both query param ?id= and json body { id })
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch (_) {}
    }

    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 });
    }

    // Use deleteMany for safe, idempotent deletion (avoids P2025 error on double clicks)
    const result = await prisma.ikeaInquiry.deleteMany({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
      deletedCount: result.count,
    });
  } catch (error: any) {
    console.error("Admin delete IKEA inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry", details: error?.message },
      { status: 500 }
    );
  }
}
