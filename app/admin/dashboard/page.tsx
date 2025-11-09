"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader, Users, Sprout, TrendingUp, Activity } from "lucide-react"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalFarms: number
  platformGrowth: number
  systemHealth: {
    uptime: number
    responseTime: number
    errorRate: number
  }
  recentActivity: Array<{
    id: string
    user: string
    action: string
    timestamp: string
  }>
  topCrops: Array<{ crop: string; count: number }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch stats")

      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError("Failed to load admin statistics")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and key metrics</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : stats ? (
          <>
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Total Users", value: stats.totalUsers, color: "primary" },
                { icon: Activity, label: "Active Users", value: stats.activeUsers, color: "accent" },
                { icon: Sprout, label: "Total Farms", value: stats.totalFarms, color: "secondary" },
                { icon: TrendingUp, label: "Growth", value: `${stats.platformGrowth}%`, color: "primary" },
              ].map((metric) => (
                <Card key={metric.label}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                        <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      </div>
                      <metric.icon className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Platform performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-primary">{stats.systemHealth.uptime}%</p>
                    <p className="text-sm text-green-600">Excellent</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-primary">{stats.systemHealth.responseTime}ms</p>
                    <p className="text-sm text-green-600">Normal</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Error Rate</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-primary">{stats.systemHealth.errorRate}%</p>
                    <p className="text-sm text-green-600">Low</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Crops */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Recommended Crops</CardTitle>
                  <CardDescription>Based on farmer recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.topCrops.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                    >
                      <span className="font-medium text-foreground">{item.crop}</span>
                      <span className="text-sm font-bold text-primary">{item.count} farms</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="pb-3 border-b border-border last:border-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">{activity.action}</p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  )
}
