import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { businessData } = await request.json()

    // Simple lead scoring algorithm (in real app, this would use AI/ML)
    let score = 50 // Base score

    // Industry scoring
    const highValueIndustries = ["technology", "finance", "healthcare"]
    if (highValueIndustries.includes(businessData?.industry?.toLowerCase())) {
      score += 20
    }

    // Website presence
    if (businessData?.website) {
      score += 15
    }

    // Services description quality
    if (businessData?.services && businessData.services.length > 50) {
      score += 10
    }

    // Target audience defined
    if (businessData?.audience && businessData.audience.length > 30) {
      score += 5
    }

    // Ensure score is within bounds
    score = Math.min(100, Math.max(0, score))

    // Generate analysis and recommendations
    let analysis = ""
    let recommendations = []

    if (score >= 80) {
      analysis = "High-quality lead with strong business foundation and clear value proposition."
      recommendations = [
        "Schedule immediate follow-up call",
        "Send premium service package information",
        "Assign to senior sales representative",
      ]
    } else if (score >= 60) {
      analysis = "Moderate-quality lead with good potential. Some areas need clarification."
      recommendations = [
        "Request additional business information",
        "Send case studies relevant to their industry",
        "Schedule discovery call within 48 hours",
      ]
    } else {
      analysis = "Early-stage lead requiring nurturing and qualification."
      recommendations = [
        "Add to email nurture sequence",
        "Send educational content about your services",
        "Follow up in 1-2 weeks with value-focused content",
      ]
    }

    return NextResponse.json({
      score,
      analysis,
      recommendations,
      factors: {
        industry: businessData?.industry || "Not specified",
        hasWebsite: !!businessData?.website,
        servicesDetail: businessData?.services?.length || 0,
        audienceClarity: businessData?.audience?.length || 0,
      },
    })
  } catch (error) {
    console.error("Error generating lead score:", error)
    return NextResponse.json({ error: "Failed to generate lead score" }, { status: 500 })
  }
}
