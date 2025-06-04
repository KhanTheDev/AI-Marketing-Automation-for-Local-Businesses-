import { type NextRequest, NextResponse } from "next/server"

interface LeadData {
  visitorId: string
  businessId: string
  page: string
  timestamp: string
  source: string
  medium: string
  campaign: string
  referrer: string
  userAgent: string
}

// In-memory storage for demo purposes
// In production, this would be stored in a database
const leads: LeadData[] = []

export async function POST(request: NextRequest) {
  try {
    const leadData: LeadData = await request.json()

    // Validate required fields
    if (!leadData.visitorId || !leadData.page) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Add to leads collection
    leads.push(leadData)

    // In a real app, we would save this to a database
    console.log("Lead tracked:", leadData)

    // Check if this is a new lead or returning visitor
    const visitorLeads = leads.filter((lead) => lead.visitorId === leadData.visitorId)
    const isNewLead = visitorLeads.length === 1

    return NextResponse.json({
      success: true,
      isNewLead,
      leadId: `lead_${Date.now()}`,
      visitorId: leadData.visitorId,
    })
  } catch (error) {
    console.error("Error tracking lead:", error)
    return NextResponse.json({ error: "Failed to track lead" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("businessId")

    if (businessId) {
      const filteredLeads = leads.filter((lead) => lead.businessId === businessId)
      return NextResponse.json({ leads: filteredLeads })
    }

    return NextResponse.json({ leads })
  } catch (error) {
    console.error("Error retrieving leads:", error)
    return NextResponse.json({ error: "Failed to retrieve leads" }, { status: 500 })
  }
}
