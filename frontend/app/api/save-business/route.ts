import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const businessData = await request.json()

    // In a real app, you would save this to a database
    // For now, we'll just validate and return success

    const requiredFields = ["businessName", "industry", "services"]
    const missingFields = requiredFields.filter((field) => !businessData[field])

    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 })
    }

    // Simulate saving to database
    console.log("Business data received:", businessData)

    return NextResponse.json({
      success: true,
      message: "Business data saved successfully",
      businessId: `biz_${Date.now()}`,
    })
  } catch (error) {
    console.error("Error saving business data:", error)
    return NextResponse.json({ error: "Failed to save business data" }, { status: 500 })
  }
}
