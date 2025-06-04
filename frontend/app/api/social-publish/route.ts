import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { content, platforms, adSpend, businessData } = await request.json()

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json({ error: "Content and platforms are required" }, { status: 400 })
    }

    // Simulate posting to multiple platforms
    const postResults = []
    const campaigns = []

    // Calculate even ad spend distribution if enabled
    let platformBudget = 0
    if (adSpend?.enabled) {
      platformBudget = (adSpend.budget * adSpend.duration) / platforms.length
    }

    for (const platform of platforms) {
      // In a real implementation, we would use the platform's API to post content
      // For this demo, we'll simulate the posting process

      // Get access token from cookies (in a real implementation)
      // const accessToken = request.cookies.get(`${platform.toLowerCase()}_access_token`)?.value

      // Simulate platform-specific API calls
      const postId = `post_${platform.toLowerCase()}_${Date.now()}`

      // Simulate different image sizes per platform
      const imageSizes = {
        Facebook: "1200x630",
        Instagram: "1080x1080",
        Twitter: "1200x675",
        LinkedIn: "1200x627",
        YouTube: "1280x720",
        TikTok: "1080x1920",
      }

      postResults.push({
        platform,
        postId,
        status: "published",
        url: `https://${platform.toLowerCase()}.com/post/${postId}`,
        estimatedReach: Math.floor(Math.random() * 1000) + 500,
        imageSize: imageSizes[platform as keyof typeof imageSizes] || "1200x630",
        publishedAt: new Date().toISOString(),
      })

      // If ad spend is enabled, create ad campaigns with even distribution
      if (adSpend?.enabled) {
        const campaignId = `camp_${platform.toLowerCase()}_${Date.now()}`

        // Calculate platform-specific metrics based on even budget distribution
        const platformReach = Math.floor(platformBudget * 50) // Estimated reach
        const platformClicks = Math.floor(platformBudget * 2) // Estimated clicks
        const platformConversions = Math.floor(platformBudget * 0.1) // Estimated conversions

        campaigns.push({
          id: campaignId,
          platform,
          budget: adSpend.budget / platforms.length, // Even daily budget distribution
          totalBudget: platformBudget,
          duration: adSpend.duration,
          status: "active",
          reach: platformReach,
          clicks: platformClicks,
          conversions: platformConversions,
          objective: adSpend.objective,
          targeting: adSpend.targeting,
          createdAt: new Date().toISOString(),
          content: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
        })
      }
    }

    // Simulate API processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Log the publishing activity
    console.log(`Published to ${platforms.length} platforms:`, {
      content: content.substring(0, 100) + "...",
      platforms,
      businessName: businessData?.businessName,
      adSpendEnabled: adSpend?.enabled,
      totalBudget: adSpend?.enabled ? adSpend.budget * adSpend.duration : 0,
      evenDistribution: adSpend?.enabled ? `${platformBudget.toFixed(2)} per platform` : "N/A",
    })

    return NextResponse.json({
      success: true,
      message: `Successfully published to ${platforms.length} platform${platforms.length > 1 ? "s" : ""}`,
      posts: postResults,
      campaigns: campaigns.length > 0 ? campaigns : null,
      totalReach: postResults.reduce((sum, post) => sum + post.estimatedReach, 0),
      adSpendTotal: adSpend?.enabled ? adSpend.budget * adSpend.duration : 0,
      adSpendPerPlatform: adSpend?.enabled ? platformBudget : 0,
    })
  } catch (error) {
    console.error("Error publishing to social media:", error)
    return NextResponse.json({ error: "Failed to publish to social media" }, { status: 500 })
  }
}
