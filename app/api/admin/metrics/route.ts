import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock response - backend would provide real metrics
    return NextResponse.json({
      uptime: 99.8,
      responseTime: 145,
      errorRate: 0.2,
      requestsPerSecond: 425,
      activeConnections: 1240,
      databaseLatency: 45,
    })
  } catch (error) {
    console.error("Metrics error:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
