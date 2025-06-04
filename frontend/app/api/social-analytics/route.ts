import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get("platform")
    const timeframe = searchParams.get("timeframe") || "7d"

    // Simulate analytics data
    const generateAnalytics = (platformName: string) => {
      const baseMetrics = {
        followers: Math.floor(Math.random() * 10000) + 1000,
        posts: Math.floor(Math.random() * 50) + 10,
        engagement: Math.floor(Math.random() * 5) + 2, // percentage
        reach: Math.floor(Math.random() * 50000) + 5000,
        impressions: Math.floor(Math.random() * 100000) + 10000,
        clicks: Math.floor(Math.random() * 1000) + 100,
      }

      return {
        platform: platformName,
        timeframe,
        metrics: baseMetrics,
        growth: {
          followers: Math.floor(Math.random() * 20) - 10, // -10% to +10%
          engagement: Math.floor(Math.random() * 30) - 15,
          reach: Math.floor(Math.random() * 40) - 20,
        },
        topPosts: [
          {
            id: `post_${platformName.toLowerCase()}_1`,
            content: "Our latest AI marketing insights are here! 🚀",
            engagement: Math.floor(Math.random() * 500) + 100,
            reach: Math.floor(Math.random() * 5000) + 1000,
            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: `post_${platformName.toLowerCase()}_2`,
            content: "Transform your business with smart automation ✨",
            engagement: Math.floor(Math.random() * 400) + 80,
            reach: Math.floor(Math.random() * 4000) + 800,
            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      }
    }

    if (platform) {
      // Return analytics for specific platform
      const analytics = generateAnalytics(platform)
      return NextResponse.json(analytics)
    } else {
      // Return analytics for all platforms
      const platforms = ["Facebook", "Instagram", "Twitter", "LinkedIn", "YouTube", "TikTok"]
      const allAnalytics = platforms.map(generateAnalytics)

      return NextResponse.json({
        timeframe,
        platforms: allAnalytics,
        summary: {
          totalFollowers: allAnalytics.reduce((sum, p) => sum + p.metrics.followers, 0),
          totalReach: allAnalytics.reduce((sum, p) => sum + p.metrics.reach, 0),
          avgEngagement: allAnalytics.reduce((sum, p) => sum + p.metrics.engagement, 0) / allAnalytics.length,
          totalClicks: allAnalytics.reduce((sum, p) => sum + p.metrics.clicks, 0),
        },
      })
    }
  } catch (error) {
    console.error("Error fetching social analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
