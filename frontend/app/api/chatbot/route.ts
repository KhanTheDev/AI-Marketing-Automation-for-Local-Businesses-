import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, businessData } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // For V0, we'll use rule-based responses
    // In V1, this would call OpenAI API with business context

    const businessName = businessData?.businessName || "your business"
    const industry = businessData?.industry || "your industry"
    const services = businessData?.services || "your services"

    const lowerMessage = message.toLowerCase()

    let response = ""

    if (lowerMessage.includes("marketing") || lowerMessage.includes("promote")) {
      response = `Great question about marketing for ${businessName}! Based on your ${industry} business, here are some AI-powered marketing strategies I recommend:

1. **Content Personalization**: Use AI to create personalized content for different customer segments
2. **Predictive Analytics**: Analyze customer behavior to predict the best times to engage
3. **Automated Email Sequences**: Set up intelligent email campaigns that adapt based on user interactions
4. **Social Media Optimization**: Use AI to determine the best posting times and content types

Given that you offer ${services.substring(0, 100)}..., I'd especially focus on content marketing that showcases your expertise.

Would you like me to elaborate on any of these strategies?`
    } else if (lowerMessage.includes("lead") || lowerMessage.includes("customer")) {
      response = `Excellent question about lead generation for ${businessName}! For ${industry} businesses like yours, here's my AI-powered approach:

1. **Lead Scoring**: Automatically qualify leads based on behavior and demographics
2. **Chatbot Qualification**: Use AI chatbots to pre-qualify website visitors 24/7
3. **Predictive Lead Scoring**: Identify which prospects are most likely to convert
4. **Automated Follow-up**: Set up intelligent sequences that nurture leads automatically

Since you specialize in ${services.substring(0, 80)}..., I'd recommend focusing on educational content that demonstrates your expertise to build trust with potential customers.

What specific aspect of lead generation would you like to explore further?`
    } else if (lowerMessage.includes("social") || lowerMessage.includes("content")) {
      response = `Perfect timing to ask about social media and content for ${businessName}! Here's how AI can supercharge your ${industry} content strategy:

1. **Content Generation**: AI can help create engaging posts tailored to your brand voice
2. **Optimal Timing**: Analyze when your audience is most active for maximum engagement
3. **Hashtag Optimization**: AI-powered hashtag research for better discoverability
4. **Performance Analytics**: Track what content performs best and why

For your ${services.substring(0, 80)}..., I'd suggest creating educational content that positions you as a thought leader in ${industry}.

Would you like me to generate some specific content ideas for your business?`
    } else if (lowerMessage.includes("roi") || lowerMessage.includes("revenue") || lowerMessage.includes("sales")) {
      response = `Great question about ROI and revenue growth for ${businessName}! Here's how AI marketing can boost your ${industry} business results:

1. **Conversion Optimization**: AI analyzes user behavior to improve conversion rates
2. **Customer Lifetime Value**: Predict and increase the value of each customer relationship
3. **Price Optimization**: Use AI to find the optimal pricing strategy
4. **Churn Prevention**: Identify at-risk customers before they leave

Given your focus on ${services.substring(0, 80)}..., I'd estimate you could see a 25-40% improvement in marketing ROI within 3-6 months with proper AI implementation.

What specific revenue goals are you trying to achieve?`
    } else if (lowerMessage.includes("start") || lowerMessage.includes("begin") || lowerMessage.includes("first")) {
      response = `Perfect question for getting started with AI marketing for ${businessName}! Here's my recommended roadmap for ${industry} businesses:

**Phase 1 (Month 1):**
- Set up basic analytics and tracking
- Implement lead capture forms with AI scoring
- Start email automation sequences

**Phase 2 (Month 2-3):**
- Launch AI-powered social media scheduling
- Implement chatbot for customer service
- Begin A/B testing with AI optimization

**Phase 3 (Month 4+):**
- Advanced personalization and segmentation
- Predictive analytics for customer behavior
- Full marketing automation integration

For your ${services.substring(0, 80)}..., I'd start with lead scoring and email automation as they typically show the fastest ROI.

Which phase sounds most relevant to where you are now?`
    } else {
      response = `Thanks for your question about ${businessName}! As an AI marketing assistant, I'm here to help you grow your ${industry} business.

I can help you with:
• Marketing strategy and planning
• Lead generation and qualification
• Social media and content creation
• ROI optimization and analytics
• Getting started with AI marketing tools

Given that you offer ${services.substring(0, 100)}..., there are many opportunities to leverage AI for growth.

Could you be more specific about what aspect of marketing you'd like to focus on? For example:
- "How can I generate more leads?"
- "What's the best social media strategy for my business?"
- "How do I measure marketing ROI?"

I'm here to provide personalized advice for your business!`
    }

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
      businessContext: {
        name: businessName,
        industry,
        servicesPreview: services.substring(0, 50) + "...",
      },
    })
  } catch (error) {
    console.error("Error in chatbot:", error)
    return NextResponse.json({ error: "Failed to process chatbot request" }, { status: 500 })
  }
}
