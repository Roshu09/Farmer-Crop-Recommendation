"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader, Download } from "lucide-react"

interface AnalyticsData {
  totalHarvest: number
  averageYield: number
  profitMargin: number
  soilHealth: number
  monthlyData: Array<{ month: string; yield: number; revenue: number }>
  cropDistribution: Array<{ crop: string; percentage: number }>
  weatherImpact: Array<{ factor: string; impact: number }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">("year")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/analytics?timeRange=${timeRange}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!response.ok) throw new Error("Failed to fetch analytics")

      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError("Failed to load analytics data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Controls */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Farm Analytics</h1>
            <p className="text-muted-foreground">Performance metrics and insights for your farm</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {["month", "quarter", "year"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range as "month" | "quarter" | "year")}
              className={timeRange === range ? "bg-primary hover:bg-primary/90" : ""}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
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
        ) : analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Harvest", value: analytics.totalHarvest, unit: "tons", color: "primary" },
                { label: "Average Yield", value: analytics.averageYield, unit: "kg/ha", color: "accent" },
                { label: "Profit Margin", value: analytics.profitMargin, unit: "%", color: "secondary" },
                { label: "Soil Health", value: analytics.soilHealth, unit: "%", color: "primary" },
              ].map((metric) => (
                <Card key={metric.label}>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                    <p className="text-3xl font-bold text-foreground">
                      {metric.value}
                      <span className="text-lg ml-1">{metric.unit}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Monthly Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Yield and revenue trends over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {analytics.monthlyData.map((month, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{month.month}</span>
                      <span className="text-sm text-muted-foreground">
                        {month.yield} kg | ₹{month.revenue}
                      </span>
                    </div>
                    <div className="flex gap-2 h-8">
                      <div className="flex-1 bg-primary/20 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${Math.min(100, (month.yield / 1000) * 100)}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-accent/20 rounded-full overflow-hidden">
                        <div
                          className="bg-accent h-full rounded-full"
                          style={{ width: `${Math.min(100, (month.revenue / 50000) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Crop Distribution & Weather Impact */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Crop Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Crop Distribution</CardTitle>
                  <CardDescription>Area allocation by crop type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.cropDistribution.map((crop, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-foreground">{crop.crop}</span>
                        <span className="text-sm font-semibold text-primary">{crop.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-accent h-full rounded-full"
                          style={{ width: `${crop.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Weather Impact */}
              <Card>
                <CardHeader>
                  <CardTitle>Weather Impact</CardTitle>
                  <CardDescription>Factor influence on yield</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.weatherImpact.map((factor, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium text-foreground">{factor.factor}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              factor.impact > 0 ? "bg-green-500" : factor.impact < 0 ? "bg-red-500" : "bg-gray-400"
                            }`}
                            style={{ width: `${Math.abs(factor.impact)}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-12 text-right">
                          {factor.impact > 0 ? "+" : ""}
                          {factor.impact}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Increase rice cultivation area by 15% - shows highest profit margin</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Implement drip irrigation to improve water efficiency by 30%</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Adjust nitrogen levels in wheat cultivation based on soil analysis</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Monitor monsoon patterns for optimal planting dates next season</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
