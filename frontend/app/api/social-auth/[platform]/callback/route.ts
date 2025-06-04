import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { platform: string } }) {
  try {
    const { platform } = params
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state") || "/social-media"

    // In a real implementation, we would exchange the code for an access token
    // For this demo, we'll simulate a successful authentication

    if (!code) {
      return NextResponse.json({ error: "Authorization code missing" }, { status: 400 })
    }

    // Simulate token exchange
    const accessToken = `simulated_${platform}_token_${Date.now()}`
    const refreshToken = `simulated_${platform}_refresh_${Date.now()}`
    const expiresIn = 3600 // 1 hour

    // Simulate user profile data
    const profileData = {
      id: `${platform}_user_${Math.floor(Math.random() * 1000000)}`,
      username: `${platform}user${Math.floor(Math.random() * 1000)}`,
      name: "Demo User",
      email: "demo@example.com",
      profilePicture: "/placeholder.svg?height=100&width=100",
      followers: Math.floor(Math.random() * 10000) + 500,
      following: Math.floor(Math.random() * 1000) + 100,
    }

    // In a real implementation, we would store this in a database
    // For this demo, we'll store it in a cookie
    const response = NextResponse.redirect(`${request.nextUrl.origin}${state}`)

    // Set cookies with the auth data
    response.cookies.set(`${platform}_access_token`, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
      path: "/",
    })

    response.cookies.set(`${platform}_refresh_token`, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    response.cookies.set(`${platform}_profile`, JSON.stringify(profileData), {
      httpOnly: false, // Allow JavaScript access
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
      path: "/",
    })

    return response
  } catch (error) {
    console.error(`Error handling ${params.platform} callback:`, error)
    return NextResponse.redirect(`${request.nextUrl.origin}/social-media?error=auth_failed`)
  }
}
