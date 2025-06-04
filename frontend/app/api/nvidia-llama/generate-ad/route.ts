import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { prompt, businessData, platform, adType } = await request.json()

    if (!prompt || !businessData || !platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real implementation, we would use the NVIDIA Llama API
    // For this demo, we'll use OpenAI as a placeholder

    // Create a system prompt based on business data and platform
    const systemPrompt = `You are an expert marketing copywriter specializing in ${platform} ads.
Create a compelling ${adType || "image"} ad for a ${businessData.industry} business named "${businessData.businessName}".
Their services include: ${businessData.services}
Their target audience is: ${businessData.audience || "general consumers"}
Their brand voice is: ${businessData.brandStyle || "professional"}
The ad should be optimized for ${platform} and follow all platform guidelines.`

    // Generate ad content
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: prompt,
    })

    // For video ads, include a storyboard structure
    let response = {
      adContent: text,
      platform,
      adType: adType || "image",
      estimatedPerformance: calculateEstimatedPerformance(platform, adType),
    }

    // Add video-specific content if needed
    if (adType === "video") {
      const { text: storyboard } = await generateText({
        model: openai("gpt-4o"),
        system: "You are a video storyboard creator. Create a detailed scene-by-scene storyboard for a short video ad.",
        prompt: `Create a storyboard for a ${platform} video ad for ${businessData.businessName}, a ${businessData.industry} business. The main message is: ${prompt}`,
      })

      response = {
        ...response,
        storyboard,
        estimatedDuration: "15-30 seconds",
        recommendedAspectRatio: platform === "Instagram" || platform === "TikTok" ? "9:16" : "16:9",
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error generating ad:", error)
    return NextResponse.json({ error: "Failed to generate ad content" }, { status: 500 })
  }
}

// Helper function to calculate estimated performance
function calculateEstimatedPerformance(platform: string, adType?: string) {
  const baseEngagementRate =
    {
      Facebook: 0.9,
      Instagram: 1.2,
      Twitter: 0.7,
      LinkedIn: 0.6,
      TikTok: 1.8,
      YouTube: 1.1,
    }[platform] || 1.0

  const typeMultiplier = adType === "video" ? 1.5 : 1.0

  return {
    engagementRate: `${(baseEngagementRate * typeMultiplier).toFixed(1)}%`,
    clickThroughRate: `${(baseEngagementRate * typeMultiplier * 0.15).toFixed(2)}%`,
    estimatedReach: Math.floor(1000 + Math.random() * 4000),
    costPerClick: `$${(0.5 + Math.random() * 1.5).toFixed(2)}`,
  }
}
