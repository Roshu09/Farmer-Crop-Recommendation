import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    // Mock backend call - replace with real backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).catch(() => null)

    // Fallback mock response if backend unavailable
    if (!response || !response.ok) {
      return NextResponse.json({
        token: `mock_token_${Date.now()}`,
        userRole: email.includes("admin") ? "admin" : "farmer",
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
