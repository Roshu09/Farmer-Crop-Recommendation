import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock backend call
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${backendUrl}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null)

    // Fallback mock response
    if (!response || !response.ok) {
      return NextResponse.json({
        totalUsers: 1250,
        activeUsers: 450,
        totalFarms: 892,
        platformGrowth: 15.3,
        systemHealth: {
          uptime: 99.8,
          responseTime: 145,
          errorRate: 0.2,
        },
        recentActivity: [
          { id: "1", user: "Farmer John", action: "Added new farm", timestamp: "2 mins ago" },
          { id: "2", user: "Farmer Sarah", action: "Viewed recommendations", timestamp: "5 mins ago" },
          { id: "3", user: "Farmer Mike", action: "Updated soil data", timestamp: "12 mins ago" },
        ],
        topCrops: [
          { crop: "Rice", count: 342 },
          { crop: "Wheat", count: 289 },
          { crop: "Maize", count: 156 },
        ],
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}
