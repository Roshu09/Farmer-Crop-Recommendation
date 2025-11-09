"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader, Download, TrendingUp, TrendingDown } from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface AnalyticsData {
  totalHarvest: number
  averageYield: number
  profitMargin: number
  soilHealth: number
  monthlyData: Array<{ month: string; yield: number; revenue: number }>
  cropDistribution: Array<{ crop: string; percentage: number; value: number }>
  weatherImpact: Array<{ factor: string; impact: number }>
  realtimeMetrics: {
    currentPrice: number
    priceChange: number
    weatherScore: number
    marketDemand: number
  }
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">("year")
  const [liveUpdate, setLiveUpdate] = useState(0)

  useEffect(() => {
    fetchAnalytics()

    // Simulate live updates every 5 seconds
    const interval = setInterval(() => {
      setLiveUpdate((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
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
            <p className="text-muted-foreground">Real-time performance metrics and insights</p>
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
            {/* Key Metrics with Live Updates */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Harvest",
                  value: analytics.totalHarvest,
                  unit: "tons",
                  trend: "+12%",
                  color: "primary",
                },
                { label: "Average Yield", value: analytics.averageYield, unit: "kg/ha", trend: "+8%", color: "accent" },
                { label: "Profit Margin", value: analytics.profitMargin, unit: "%", trend: "+5%", color: "secondary" },
                { label: "Soil Health", value: analytics.soilHealth, unit: "%", trend: "+3%", color: "primary" },
              ].map((metric) => (
                <Card key={metric.label} className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                        <TrendingUp className="w-3 h-3" />
                        {metric.trend}
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                      {metric.value}
                      <span className="text-lg ml-1 text-muted-foreground">{metric.unit}</span>
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 to-primary/60 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Real-time Price & Weather Tracking */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Live Market Prices
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </CardTitle>
                  <CardDescription>Real-time commodity price tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      price: {
                        label: "Price (₹/kg)",
                        color: "hsl(var(--primary))",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analytics.monthlyData.map((m, idx) => ({
                          month: m.month,
                          price: 25 + Math.sin(idx + liveUpdate * 0.5) * 5,
                        }))}
                      >
                        <defs>
                          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="hsl(var(--primary))"
                          fillOpacity={1}
                          fill="url(#priceGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Weather Impact Trends
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  </CardTitle>
                  <CardDescription>Weather conditions affecting yield</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      impact: {
                        label: "Impact Score",
                        color: "hsl(var(--accent))",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.weatherImpact}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="factor" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="impact"
                          stroke="hsl(var(--accent))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--accent))", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Yield and revenue trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    yield: {
                      label: "Yield (kg)",
                      color: "hsl(var(--primary))",
                    },
                    revenue: {
                      label: "Revenue (₹)",
                      color: "hsl(var(--accent))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="yield" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Crop Distribution & Weather Impact */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Crop Distribution</CardTitle>
                  <CardDescription>Area allocation by crop type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Area",
                        color: "hsl(var(--primary))",
                      },
                    }}
                    className="h-[250px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.cropDistribution} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                        <YAxis dataKey="crop" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weather Impact Analysis</CardTitle>
                  <CardDescription>Factor influence on yield performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.weatherImpact.map((factor, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">{factor.factor}</span>
                        <div className="flex items-center gap-1">
                          {factor.impact > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-semibold ${factor.impact > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {factor.impact > 0 ? "+" : ""}
                            {factor.impact}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            factor.impact > 0 ? "bg-green-500" : "bg-red-500"
                          }`}
                          style={{ width: `${Math.abs(factor.impact)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* AI Recommendations */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle>AI-Powered Optimization Recommendations</CardTitle>
                <CardDescription>Based on real-time data analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2 items-start">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>
                      Increase rice cultivation area by 15% - shows highest profit margin of ₹{analytics.profitMargin}
                      /ha
                    </span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>
                      Current weather conditions are optimal for wheat planting - humidity at{" "}
                      {analytics.realtimeMetrics?.weatherScore || 65}%
                    </span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>
                      Market demand for pulses increased by {analytics.realtimeMetrics?.marketDemand || 18}% - consider
                      expanding cultivation
                    </span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Soil nitrogen levels optimal - maintain current fertilizer schedule for best yield</span>
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
