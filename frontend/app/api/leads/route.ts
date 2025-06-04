import { type NextRequest, NextResponse } from "next/server"

// In a real application, this would be fetched from a database
// For demo purposes, we'll generate some sample leads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("businessId") || "default"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Generate sample leads
    const leads = generateSampleLeads(businessId, 50)

    // Paginate results
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const paginatedLeads = leads.slice(startIndex, endIndex)

    // Calculate lead scores
    const leadsWithScores = paginatedLeads.map((lead) => ({
      ...lead,
      score: calculateLeadScore(lead),
    }))

    return NextResponse.json({
      leads: leadsWithScores,
      pagination: {
        total: leads.length,
        page,
        limit,
        pages: Math.ceil(leads.length / limit),
      },
    })
  } catch (error) {
    console.error("Error retrieving leads:", error)
    return NextResponse.json({ error: "Failed to retrieve leads" }, { status: 500 })
  }
}

// Helper function to generate sample leads
function generateSampleLeads(businessId: string, count: number) {
  const sources = ["google", "facebook", "linkedin", "direct", "referral", "email"]
  const pages = ["/", "/features", "/pricing", "/contact", "/blog"]

  return Array.from({ length: count }, (_, i) => {
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30))

    const lastActive = new Date(createdAt)
    lastActive.setHours(lastActive.getHours() + Math.floor(Math.random() * 72))

    const pageViews = Math.floor(Math.random() * 10) + 1
    const source = sources[Math.floor(Math.random() * sources.length)]

    return {
      id: `lead_${i + 1}`,
      visitorId: `visitor_${Date.now() - i * 1000}_${Math.random().toString(36).substring(2, 9)}`,
      businessId,
      firstPage: pages[Math.floor(Math.random() * pages.length)],
      pageViews,
      source,
      medium: source === "direct" ? "none" : "cpc",
      campaign: source === "direct" ? "none" : "summer_promo",
      createdAt: createdAt.toISOString(),
      lastActive: lastActive.toISOString(),
      actions: Math.floor(Math.random() * pageViews),
      converted: Math.random() > 0.7,
      email: Math.random() > 0.5 ? `lead${i + 1}@example.com` : null,
    }
  })
}

// Helper function to calculate lead score
function calculateLeadScore(lead: any) {
  let score = 50 // Base score

  // More page views = higher score
  score += lead.pageViews * 3

  // More actions = higher score
  score += lead.actions * 5

  // Recent activity = higher score
  const daysSinceActive = Math.floor((Date.now() - new Date(lead.lastActive).getTime()) / (1000 * 60 * 60 * 24))
  score -= daysSinceActive * 2

  // If they've provided email, higher score
  if (lead.email) score += 15

  // If they've converted, max score
  if (lead.converted) score = 100

  // Ensure score is within bounds
  return Math.min(100, Math.max(0, Math.round(score)))
}
