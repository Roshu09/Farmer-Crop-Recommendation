import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock backend call
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const response = await fetch(`${backendUrl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null)

    // Fallback mock response
    if (!response || !response.ok) {
      return NextResponse.json({
        users: [
          {
            id: "1",
            firstName: "Rajesh",
            lastName: "Kumar",
            email: "rajesh@farm.com",
            state: "Punjab",
            district: "Ludhiana",
            joinDate: "2024-01-15",
            status: "active",
            farmSize: 25,
          },
          {
            id: "2",
            firstName: "Priya",
            lastName: "Singh",
            email: "priya@farm.com",
            state: "Haryana",
            district: "Karnal",
            joinDate: "2024-02-20",
            status: "active",
            farmSize: 18,
          },
          {
            id: "3",
            firstName: "Arjun",
            lastName: "Patel",
            email: "arjun@farm.com",
            state: "Gujarat",
            district: "Anand",
            joinDate: "2023-12-10",
            status: "inactive",
            farmSize: 32,
          },
        ],
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
