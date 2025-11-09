import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock backend call
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${backendUrl}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null)

    // Fallback mock response
    if (!response || !response.ok) {
      return NextResponse.json({
        weather: {
          temperature: 28,
          humidity: 65,
          rainfall: 120,
          forecast: "Scattered showers expected",
        },
        soil: {
          nitrogen: 45,
          phosphorus: 35,
          potassium: 180,
          pH: 6.5,
          moisture: 65,
        },
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
