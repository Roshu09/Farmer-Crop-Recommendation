import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock backend call
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${backendUrl}/api/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null)

    // Fallback mock response
    if (!response || !response.ok) {
      return NextResponse.json({
        recommendations: [
          {
            id: "1",
            cropName: "Rice",
            suitability: 95,
            reason: "Ideal soil pH and moisture levels",
            benefits: ["High yield potential", "Good market demand"],
            riskFactors: ["Requires frequent irrigation"],
            estimatedYield: "6.5 tonnes/ha",
            marketPrice: 2500,
          },
          {
            id: "2",
            cropName: "Wheat",
            suitability: 85,
            reason: "Suitable conditions with minor adjustments",
            benefits: ["Lower water requirements", "Good market value"],
            riskFactors: ["Needs additional potassium"],
            estimatedYield: "5.2 tonnes/ha",
            marketPrice: 2200,
          },
          {
            id: "3",
            cropName: "Maize",
            suitability: 80,
            reason: "Can be grown with crop rotation",
            benefits: ["Pest resistance", "Quick growth cycle"],
            riskFactors: ["Soil pH needs adjustment"],
            estimatedYield: "4.8 tonnes/ha",
            marketPrice: 1800,
          },
        ],
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Recommendations error:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
