"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader, Search, TrendingUp, TrendingDown } from "lucide-react"

interface MarketAnalysis {
  cropName: string
  currentPrice: number
  weeklyChange: number
  monthlyChange: number
  bestTime: string
  predictedPrice: number
  supplyStatus: "high" | "medium" | "low"
  demandStatus: "high" | "medium" | "low"
  priceHistory: Array<{ date: string; price: number }>
  marketShare: number
  bestMarkets: Array<{ market: string; price: number }>
}

export default function MarketAnalysisPage() {
  const [analyses, setAnalyses] = useState<MarketAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCrop, setSelectedCrop] = useState<MarketAnalysis | null>(null)

  useEffect(() => {
    fetchMarketAnalysis()
  }, [])

  const fetchMarketAnalysis = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/market-analysis`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!response.ok) throw new Error("Failed to fetch market analysis")

      const data = await response.json()
      setAnalyses(data.analyses)
      if (data.analyses.length > 0) setSelectedCrop(data.analyses[0])
    } catch (err) {
      setError("Failed to load market analysis")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredAnalyses = analyses.filter((a) => a.cropName.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStatusColor = (status: string) => {
    if (status === "high") return "text-green-600 bg-green-50"
    if (status === "low") return "text-red-600 bg-red-50"
    return "text-amber-600 bg-amber-50"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Market Analysis</h1>
          <p className="text-muted-foreground">Detailed market insights and price predictions</p>
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
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Crop List */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAnalyses.map((analysis) => (
                  <Card
                    key={analysis.cropName}
                    className={`cursor-pointer transition-all ${
                      selectedCrop?.cropName === analysis.cropName
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedCrop(analysis)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{analysis.cropName}</p>
                          <p className="text-2xl font-bold text-primary">₹{analysis.currentPrice}</p>
                          <p
                            className={`text-xs font-semibold ${
                              analysis.weeklyChange >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {analysis.weeklyChange >= 0 ? "+" : ""}
                            {analysis.weeklyChange}% weekly
                          </p>
                        </div>
                        {analysis.weeklyChange >= 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right: Detailed Analysis */}
            {selectedCrop && (
              <div className="lg:col-span-2 space-y-4">
                {/* Header Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">{selectedCrop.cropName}</CardTitle>
                    <CardDescription>Current market analysis and forecast</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                        <p className="text-3xl font-bold text-foreground">₹{selectedCrop.currentPrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Predicted Price</p>
                        <p className="text-3xl font-bold text-primary">₹{selectedCrop.predictedPrice}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Price Changes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Price Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Weekly Change</p>
                        <p
                          className={`text-2xl font-bold ${
                            selectedCrop.weeklyChange >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {selectedCrop.weeklyChange >= 0 ? "+" : ""}
                          {selectedCrop.weeklyChange}%
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Monthly Change</p>
                        <p
                          className={`text-2xl font-bold ${
                            selectedCrop.monthlyChange >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {selectedCrop.monthlyChange >= 0 ? "+" : ""}
                          {selectedCrop.monthlyChange}%
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm font-semibold text-foreground mb-2">Best Selling Time</p>
                      <p className="text-sm text-muted-foreground">{selectedCrop.bestTime}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Supply & Demand */}
                <Card>
                  <CardHeader>
                    <CardTitle>Market Status</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Supply Status</p>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedCrop.supplyStatus)}`}
                      >
                        {selectedCrop.supplyStatus.charAt(0).toUpperCase() + selectedCrop.supplyStatus.slice(1)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Demand Status</p>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedCrop.demandStatus)}`}
                      >
                        {selectedCrop.demandStatus.charAt(0).toUpperCase() + selectedCrop.demandStatus.slice(1)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Best Markets */}
                <Card>
                  <CardHeader>
                    <CardTitle>Best Markets</CardTitle>
                    <CardDescription>Highest prices for your location</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedCrop.bestMarkets.map((market, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="font-medium text-foreground">{market.market}</span>
                          <span className="font-bold text-primary">₹{market.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-primary hover:bg-primary/90">Sell Now</Button>
                  <Button variant="outline">Set Price Alert</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
