import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: "CREATE" | "EDIT" | "SOFT_DELETE" | "RESTORE";
  author: string;
  details?: string;
  changes?: Array<{ field: string; from: any; to: any }>;
  reason?: string;
}

function parseFlightDataWithLogs(raw: string | null | undefined): { dataObj: any; logs: AuditLogEntry[] } {
  let dataObj: any = {};
  let logs: AuditLogEntry[] = [];

  if (raw) {
    try {
      dataObj = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (Array.isArray(dataObj?.auditLogs)) {
        logs = dataObj.auditLogs;
      }
    } catch {
      dataObj = { rawString: raw };
    }
  }

  return { dataObj, logs };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status === "DELETED") {
      where.status = "DELETED";
    } else if (status && status !== "ALL") {
      where.status = status;
    } else {
      // By default ("ALL" or unspecified), exclude soft-deleted inquiries from the main view
      where.status = { not: "DELETED" };
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

    const [inquiries, deletedCount] = await Promise.all([
      prisma.flightInquiry.findMany({
        where,
        include: {
          passengers: {
            orderBy: { passengerIndex: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.flightInquiry.count({
        where: { status: "DELETED" },
      }),
    ]);

    return NextResponse.json(
      { inquiries, deletedCount },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error: any) {
    console.error("Failed to load flight inquiries:", error);
    return NextResponse.json(
      { error: "Failed to load flight inquiries", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Edit inquiry details with full audit log tracking
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await req.json();
    const { 
      id, 
      status, 
      adminNotes,
      contactFirstName,
      contactLastName,
      phoneNumber,
      email,
      departDate,
      returnDate,
      editReason,
      author: clientAuthor
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing inquiry id" }, { status: 400 });
    }

    const existing = await prisma.flightInquiry.findUnique({
      where: { id },
      include: { passengers: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Flight inquiry not found" }, { status: 404 });
    }

    const author = (session?.user as any)?.email || clientAuthor || "Admin";
    const changes: Array<{ field: string; from: any; to: any }> = [];

    const dataToUpdate: any = {};

    if (status !== undefined && status !== existing.status) {
      changes.push({ field: "Status", from: existing.status, to: status });
      dataToUpdate.status = status;
    }

    if (adminNotes !== undefined && adminNotes !== existing.adminNotes) {
      changes.push({ field: "Admin Notes", from: existing.adminNotes || "None", to: adminNotes || "None" });
      dataToUpdate.adminNotes = adminNotes;
    }

    if (contactFirstName !== undefined && contactFirstName !== existing.contactFirstName) {
      changes.push({ field: "First Name", from: existing.contactFirstName, to: contactFirstName });
      dataToUpdate.contactFirstName = contactFirstName;
    }

    if (contactLastName !== undefined && contactLastName !== existing.contactLastName) {
      changes.push({ field: "Last Name", from: existing.contactLastName, to: contactLastName });
      dataToUpdate.contactLastName = contactLastName;
    }

    if (phoneNumber !== undefined && phoneNumber !== existing.phoneNumber) {
      changes.push({ field: "Phone Number", from: existing.phoneNumber, to: phoneNumber });
      dataToUpdate.phoneNumber = phoneNumber;
    }

    if (email !== undefined && email !== existing.email) {
      changes.push({ field: "Email", from: existing.email || "None", to: email || "None" });
      dataToUpdate.email = email;
    }

    if (departDate !== undefined && departDate !== existing.departDate) {
      changes.push({ field: "Departure Date", from: existing.departDate, to: departDate });
      dataToUpdate.departDate = departDate;
    }

    if (returnDate !== undefined && returnDate !== existing.returnDate) {
      changes.push({ field: "Return Date", from: existing.returnDate || "N/A", to: returnDate || "N/A" });
      dataToUpdate.returnDate = returnDate;
    }

    // Append Audit Log entry if changes occurred
    const { dataObj, logs } = parseFlightDataWithLogs(existing.flightData);

    if (changes.length > 0) {
      const newLog: AuditLogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        action: "EDIT",
        author,
        changes,
        details: editReason || `Updated: ${changes.map(c => c.field).join(", ")}`,
      };

      dataObj.auditLogs = [newLog, ...logs];
      dataToUpdate.flightData = JSON.stringify(dataObj);
    }

    const updated = await prisma.flightInquiry.update({
      where: { id },
      data: dataToUpdate,
      include: { passengers: true },
    });

    return NextResponse.json({ 
      success: true, 
      inquiry: updated, 
      auditLog: dataObj.auditLogs?.[0] || null 
    });
  } catch (error: any) {
    console.error("Failed to update flight inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update flight inquiry", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Soft-delete flight inquiry (removes from active view, persists in database with audit log)
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);
    const id = body.id || searchParams.get("id");
    const reason = body.reason || searchParams.get("reason") || "Deleted by admin";
    const clientAuthor = body.author || searchParams.get("author");

    if (!id) {
      return NextResponse.json({ error: "Missing inquiry id" }, { status: 400 });
    }

    const existing = await prisma.flightInquiry.findUnique({
      where: { id },
      include: { passengers: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Flight inquiry not found" }, { status: 404 });
    }

    const author = (session?.user as any)?.email || clientAuthor || "Admin";
    const { dataObj, logs } = parseFlightDataWithLogs(existing.flightData);

    const softDeleteLog: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      action: "SOFT_DELETE",
      author,
      reason,
      details: `Soft-deleted from main dashboard view. Preserved in database. Previous status: ${existing.status}`,
    };

    dataObj.previousStatus = existing.status;
    dataObj.auditLogs = [softDeleteLog, ...logs];

    // Soft delete: status is set to "DELETED", record remains in database!
    const softDeleted = await prisma.flightInquiry.update({
      where: { id },
      data: {
        status: "DELETED",
        flightData: JSON.stringify(dataObj),
      },
      include: { passengers: true },
    });

    return NextResponse.json({
      success: true,
      message: `Inquiry ${existing.inquiryNumber} soft-deleted successfully and preserved in database.`,
      inquiry: softDeleted,
    });
  } catch (error: any) {
    console.error("Failed to soft-delete flight inquiry:", error);
    return NextResponse.json(
      { error: "Failed to soft-delete flight inquiry", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST: Restore a soft-deleted inquiry back to active status
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await req.json();
    const { id, action, author: clientAuthor } = body;

    if (action !== "RESTORE") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing inquiry id" }, { status: 400 });
    }

    const existing = await prisma.flightInquiry.findUnique({
      where: { id },
      include: { passengers: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Flight inquiry not found" }, { status: 404 });
    }

    const author = (session?.user as any)?.email || clientAuthor || "Admin";
    const { dataObj, logs } = parseFlightDataWithLogs(existing.flightData);

    // Restore to previousStatus or default to "PENDING"
    const restoredStatus = (dataObj.previousStatus && dataObj.previousStatus !== "DELETED")
      ? dataObj.previousStatus
      : "PENDING";

    const restoreLog: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      action: "RESTORE",
      author,
      details: `Restored back to ${restoredStatus} from soft-deleted archive.`,
    };

    dataObj.auditLogs = [restoreLog, ...logs];

    const restored = await prisma.flightInquiry.update({
      where: { id },
      data: {
        status: restoredStatus,
        flightData: JSON.stringify(dataObj),
      },
      include: { passengers: true },
    });

    return NextResponse.json({
      success: true,
      message: `Inquiry ${existing.inquiryNumber} restored to ${restoredStatus}.`,
      inquiry: restored,
    });
  } catch (error: any) {
    console.error("Failed to restore flight inquiry:", error);
    return NextResponse.json(
      { error: "Failed to restore flight inquiry", message: error.message },
      { status: 500 }
    );
  }
}
