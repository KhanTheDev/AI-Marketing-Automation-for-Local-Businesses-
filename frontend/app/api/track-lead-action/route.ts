import { type NextRequest, NextResponse } from "next/server"

interface LeadAction {
  visitorId: string
  businessId: string
  page: string
  element: string
  elementText: string
  timestamp: string
  action: string
}

// In-memory storage for demo purposes
// In production, this would be stored in a database
const leadActions: LeadAction[] = []

export async function POST(request: NextRequest) {
  try {
    const actionData: LeadAction = await request.json()

    // Validate required fields
    if (!actionData.visitorId || !actionData.action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Add to lead actions collection
    leadActions.push(actionData)

    // In a real app, we would save this to a database
    console.log("Lead action tracked:", actionData)

    // Calculate engagement score based on actions
    const visitorActions = leadActions.filter((action) => action.visitorId === actionData.visitorId)
    const engagementScore = Math.min(100, visitorActions.length * 5) // Simple scoring algorithm

    return NextResponse.json({
      success: true,
      actionId: `action_${Date.now()}`,
      visitorId: actionData.visitorId,
      engagementScore,
    })
  } catch (error) {
    console.error("Error tracking lead action:", error)
    return NextResponse.json({ error: "Failed to track lead action" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visitorId = searchParams.get("visitorId")

    if (visitorId) {
      const filteredActions = leadActions.filter((action) => action.visitorId === visitorId)
      return NextResponse.json({ actions: filteredActions })
    }

    return NextResponse.json({ actions: leadActions })
  } catch (error) {
    console.error("Error retrieving lead actions:", error)
    return NextResponse.json({ error: "Failed to retrieve lead actions" }, { status: 500 })
  }
}
