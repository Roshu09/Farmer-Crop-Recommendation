import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock backend call
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${backendUrl}/api/admin/crops`, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null)

    // Fallback mock response
    if (!response || !response.ok) {
      return NextResponse.json({
        crops: [
          {
            id: "1",
            name: "Rice",
            season: "Kharif (Monsoon)",
            ph_min: 6.0,
            ph_max: 7.5,
            moisture_min: 50,
            moisture_max: 100,
            avg_yield: 6.5,
            market_demand: "high",
          },
          {
            id: "2",
            name: "Wheat",
            season: "Rabi (Winter)",
            ph_min: 6.5,
            ph_max: 7.8,
            moisture_min: 30,
            moisture_max: 60,
            avg_yield: 5.2,
            market_demand: "high",
          },
          {
            id: "3",
            name: "Maize",
            season: "Kharif",
            ph_min: 6.0,
            ph_max: 7.5,
            moisture_min: 40,
            moisture_max: 80,
            avg_yield: 4.8,
            market_demand: "medium",
          },
          {
            id: "4",
            name: "Cotton",
            season: "Kharif",
            ph_min: 6.0,
            ph_max: 7.5,
            moisture_min: 35,
            moisture_max: 70,
            avg_yield: 2.5,
            market_demand: "high",
          },
        ],
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Admin crops error:", error)
    return NextResponse.json({ error: "Failed to fetch crops" }, { status: 500 })
  }
}
