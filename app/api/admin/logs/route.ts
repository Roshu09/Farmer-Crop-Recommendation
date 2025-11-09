import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock response with sample logs
    return NextResponse.json({
      logs: [
        { id: "1", timestamp: "2 mins ago", level: "info", message: "User login successful", source: "auth-service" },
        { id: "2", timestamp: "5 mins ago", level: "info", message: "Crop data updated", source: "admin-service" },
        {
          id: "3",
          timestamp: "8 mins ago",
          level: "warning",
          message: "High API latency detected",
          source: "monitoring",
        },
        {
          id: "4",
          timestamp: "12 mins ago",
          level: "info",
          message: "Market prices synchronized",
          source: "market-service",
        },
        {
          id: "5",
          timestamp: "15 mins ago",
          level: "error",
          message: "Database connection timeout",
          source: "database",
        },
      ],
    })
  } catch (error) {
    console.error("Logs error:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}
