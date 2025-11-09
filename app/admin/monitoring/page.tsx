"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader, Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface SystemMetrics {
  uptime: number
  responseTime: number
  errorRate: number
  requestsPerSecond: number
  activeConnections: number
  databaseLatency: number
}

interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "warning" | "error"
  message: string
  source: string
}

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchMetricsAndLogs()

    const interval = autoRefresh ? setInterval(fetchMetricsAndLogs, 5000) : undefined
    return () => clearInterval(interval as NodeJS.Timeout)
  }, [autoRefresh])

  const fetchMetricsAndLogs = async () => {
    const token = localStorage.getItem("token")
    try {
      const [metricsRes, logsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/metrics`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData)
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json()
        setLogs(logsData.logs || [])
      }

      setLoading(false)
    } catch (err) {
      setError("Failed to load system data")
      console.error(err)
    }
  }

  const getHealthStatus = (errorRate: number) => {
    if (errorRate < 0.1) return { status: "healthy", color: "text-green-600" }
    if (errorRate < 0.5) return { status: "warning", color: "text-yellow-600" }
    return { status: "critical", color: "text-destructive" }
  }

  const health = metrics ? getHealthStatus(metrics.errorRate) : null

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">System Monitoring</h1>
            <p className="text-muted-foreground">Real-time system health and performance metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              Auto-refresh (5s)
            </label>
          </div>
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
        ) : metrics ? (
          <>
            {/* System Health Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { icon: Activity, label: "Uptime", value: `${metrics.uptime}%`, color: "text-green-600" },
                { icon: Clock, label: "Response Time", value: `${metrics.responseTime}ms`, color: "text-blue-600" },
                {
                  icon: AlertTriangle,
                  label: "Error Rate",
                  value: `${metrics.errorRate}%`,
                  color: metrics.errorRate > 0.5 ? "text-destructive" : "text-yellow-600",
                },
                { icon: Activity, label: "RPS", value: `${metrics.requestsPerSecond}`, color: "text-accent" },
                {
                  icon: Activity,
                  label: "Active Connections",
                  value: `${metrics.activeConnections}`,
                  color: "text-primary",
                },
                { icon: Clock, label: "DB Latency", value: `${metrics.databaseLatency}ms`, color: "text-accent" },
              ].map((metric) => (
                <Card key={metric.label}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <metric.icon className={`w-4 h-4 ${metric.color}`} />
                      </div>
                      <p className="text-xl font-bold text-foreground">{metric.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Health Status */}
            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className={`w-5 h-5 ${health?.color}`} />
                    System Health: <span className="capitalize">{health?.status}</span>
                  </CardTitle>
                </div>
                <CardDescription>Overall platform stability and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">API Response Time</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-primary">{metrics.responseTime}ms</p>
                        <p className="text-sm text-green-600">Within SLA</p>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Database Latency</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-primary">{metrics.databaseLatency}ms</p>
                        <p className="text-sm text-green-600">Optimal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Logs */}
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent system events and warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-3 rounded-lg border ${
                          log.level === "error"
                            ? "border-destructive/30 bg-destructive/10"
                            : log.level === "warning"
                              ? "border-yellow-600/30 bg-yellow-50"
                              : "border-border bg-muted/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {log.level === "error" ? (
                                <AlertCircle className="w-4 h-4 text-destructive" />
                              ) : log.level === "warning" ? (
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              ) : (
                                <Activity className="w-4 h-4 text-primary" />
                              )}
                              <span className="text-xs font-semibold uppercase text-muted-foreground">{log.level}</span>
                            </div>
                            <p className="text-sm font-medium text-foreground mt-1">{log.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{log.source}</p>
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No recent logs</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </AdminLayout>
  )
}
