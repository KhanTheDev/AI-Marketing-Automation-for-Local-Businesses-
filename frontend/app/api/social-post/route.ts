import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { businessData } = await request.json()

    // For V0, we'll use template-based post generation
    // In V1, this would call OpenAI API

    const businessName = businessData?.businessName || "Your Business"
    const industry = businessData?.industry || "business"
    const services = businessData?.services || "our services"
    const brandStyle = businessData?.brandStyle || "professional"

    const postTemplates = {
      professional: [
        `🚀 Exciting news from ${businessName}! We're transforming the ${industry} industry with innovative solutions. ${services.substring(0, 100)}... 

#Innovation #${industry.charAt(0).toUpperCase() + industry.slice(1)} #BusinessGrowth`,

        `💡 At ${businessName}, we believe in delivering excellence. Our expertise in ${industry} helps businesses achieve their goals through ${services.substring(0, 80)}...

Ready to elevate your business? Let's connect! 

#Excellence #${industry} #ProfessionalServices`,
      ],
      friendly: [
        `Hey everyone! 👋 

We're so excited to share what we've been working on at ${businessName}! Our team has been busy creating amazing ${services.substring(0, 100)}...

Drop us a comment if you'd like to learn more! 😊

#${businessName.replace(/\s+/g, "")} #${industry} #Community`,

        `Happy Monday, friends! ☀️

Starting the week strong at ${businessName}. We love helping businesses in ${industry} succeed with ${services.substring(0, 80)}...

What are your goals this week? Share below! 👇

#MondayMotivation #${industry} #BusinessSupport`,
      ],
      creative: [
        `🎨 Creativity meets ${industry} at ${businessName}! 

We're not just another company - we're innovators, dreamers, and problem-solvers. Our unique approach to ${services.substring(0, 100)}...

Ready to think outside the box? 📦✨

#Creative${industry.charAt(0).toUpperCase() + industry.slice(1)} #Innovation #ThinkDifferent`,

        `🌟 Plot twist: ${industry} doesn't have to be boring! 

At ${businessName}, we're rewriting the rules with ${services.substring(0, 80)}...

Who says business can't be fun AND profitable? 🎉

#DisruptThe${industry.charAt(0).toUpperCase() + industry.slice(1)} #FunBusiness #Innovation`,
      ],
    }

    const styleTemplates = postTemplates[brandStyle as keyof typeof postTemplates] || postTemplates.professional
    const selectedPost = styleTemplates[Math.floor(Math.random() * styleTemplates.length)]

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      post: selectedPost,
      platforms: ["LinkedIn", "Twitter", "Facebook"],
      hashtags: [`#${industry}`, "#BusinessGrowth", "#Innovation"],
      estimatedReach: Math.floor(Math.random() * 500) + 200,
      bestTimeToPost: "2:00 PM - 4:00 PM",
    })
  } catch (error) {
    console.error("Error generating social post:", error)
    return NextResponse.json({ error: "Failed to generate social post" }, { status: 500 })
  }
}
