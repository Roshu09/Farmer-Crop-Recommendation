import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, state, district } = await request.json()

    // Validate inputs
    if (!firstName || !lastName || !email || !password || !state || !district) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock backend call - replace with real backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${backendUrl}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        location: { state, district },
      }),
    }).catch(() => null)

    // Fallback mock response if backend unavailable
    if (!response || !response.ok) {
      return NextResponse.json({
        token: `mock_token_${Date.now()}`,
        userRole: "farmer",
        user: { firstName, lastName, email },
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
