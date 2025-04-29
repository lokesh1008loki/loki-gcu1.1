import { NextResponse } from "next/server"
import { google } from "googleapis"
import prisma from "@/lib/db"

// Google Sheets API credentials
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formId, formData } = body

    // Validate required fields
    if (!formId || !formData) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Validate phone number is present
    if (!formData.phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required for all form submissions" },
        { status: 400 },
      )
    }

    // Get form configuration from database
    const formConfig = await prisma.formConfig.findUnique({
      where: { id: formId },
    })

    if (!formConfig) {
      return NextResponse.json({ success: false, message: "Form configuration not found" }, { status: 404 })
    }

    // Create JWT client for authentication
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: SCOPES,
    })

    // Create Google Sheets instance
    const sheets = google.sheets({ version: "v4", auth })

    // Prepare data for Google Sheets
    // First row will be headers if the sheet is empty
    const headers = Object.keys(formData)

    // Second row will be the actual data
    const values = Object.values(formData)

    // Check if sheet exists and has headers
    const sheetInfo = await sheets.spreadsheets.values.get({
      spreadsheetId: formConfig.sheetId,
      range: `${formConfig.sheetName || "Sheet1"}!A1:Z1`,
    })

    let response

    // If sheet is empty or doesn't have headers, add headers first
    if (!sheetInfo.data.values || sheetInfo.data.values.length === 0) {
      // Add headers and data
      response = await sheets.spreadsheets.values.append({
        spreadsheetId: formConfig.sheetId,
        range: formConfig.sheetName || "Sheet1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [headers, values],
        },
      })
    } else {
      // Just add data
      response = await sheets.spreadsheets.values.append({
        spreadsheetId: formConfig.sheetId,
        range: formConfig.sheetName || "Sheet1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [values],
        },
      })
    }

    // Store submission in database for backup
    await prisma.formSubmission.create({
      data: {
        formConfigId: formId,
        data: formData,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Form data successfully submitted",
      updatedCells: response.data.updates?.updatedCells,
    })
  } catch (error: any) {
    console.error("Form submission error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to submit form data", error: error.message },
      { status: 500 },
    )
  }
}
