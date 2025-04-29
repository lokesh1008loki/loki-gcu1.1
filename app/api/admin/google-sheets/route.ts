import { NextResponse } from "next/server"
import { google } from "googleapis"

// Google Sheets API credentials
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formData, sheetId, sheetName } = body

    if (!formData || !sheetId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create JWT client for authentication
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: SCOPES,
    })

    // Create Google Sheets instance
    const sheets = google.sheets({ version: "v4", auth })

    // Convert form data to array format for Google Sheets
    const values = Object.entries(formData).map(([key, value]) => [key, value])

    // Append data to the specified Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: sheetName || "Sheet1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values.flat()],
      },
    })

    return NextResponse.json({
      success: true,
      message: "Data successfully sent to Google Sheets",
      updatedCells: response.data.updates?.updatedCells,
    })
  } catch (error: any) {
    console.error("Google Sheets API error:", error)
    return NextResponse.json({ message: "Failed to send data to Google Sheets", error: error.message }, { status: 500 })
  }
}
