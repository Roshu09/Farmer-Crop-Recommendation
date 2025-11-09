import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock backend call
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${backendUrl}/api/market-prices`, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null)

    // Fallback mock response
    if (!response || !response.ok) {
      return NextResponse.json({
        prices: [
          { crop: "Rice", price: 2500, change: 2.5, unit: "per quintal" },
          { crop: "Wheat", price: 2200, change: -1.2, unit: "per quintal" },
          { crop: "Maize", price: 1800, change: 1.8, unit: "per quintal" },
          { crop: "Potato", price: 1200, change: 0.5, unit: "per kg" },
          { crop: "Onion", price: 1500, change: 3.2, unit: "per kg" },
          { crop: "Cotton", price: 5200, change: -0.8, unit: "per quintal" },
        ],
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Market prices error:", error)
    return NextResponse.json({ error: "Failed to fetch market prices" }, { status: 500 })
  }
}
