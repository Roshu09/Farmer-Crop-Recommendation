"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader, TrendingDown, TrendingUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface CropPrice {
  id: string
  cropName: string
  price: number
  priceChange: number
  trend: "up" | "down" | "stable"
  supply: string
  demand: string
  quality: string
}

export default function MarketPage() {
  const [prices, setPrices] = useState<CropPrice[]>([])
  const [filteredPrices, setFilteredPrices] = useState<CropPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchMarketPrices()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = prices.filter((price) => price.cropName.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredPrices(filtered)
    } else {
      setFilteredPrices(prices)
    }
  }, [searchQuery, prices])

  const fetchMarketPrices = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/market/prices`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch prices")

      const data = await response.json()
      setPrices(data.prices)
      setFilteredPrices(data.prices)
    } catch (err) {
      setError("Failed to load market prices")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Market Prices</h1>
            <p className="text-muted-foreground">Real-time crop prices and market trends in your region</p>
          </div>

          <div className="w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search crops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      {searchQuery ? "No crops found matching your search." : "No market prices available"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredPrices.map((crop) => (
                <Card key={crop.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{crop.cropName}</CardTitle>
                        <CardDescription>Current market rate</CardDescription>
                      </div>
                      {crop.trend === "up" ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : crop.trend === "down" ? (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      ) : (
                        <div className="w-5 h-5 text-muted-foreground">—</div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Price */}
                    <div>
                      <p className="text-3xl font-bold text-foreground">₹{crop.price}</p>
                      <p
                        className={`text-sm font-semibold ${crop.priceChange >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {crop.priceChange >= 0 ? "+" : ""}
                        {crop.priceChange}% this week
                      </p>
                    </div>

                    {/* Market Info */}
                    <div className="grid grid-cols-3 gap-2 text-sm pt-3 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Supply</p>
                        <p className="font-semibold text-foreground">{crop.supply}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Demand</p>
                        <p className="font-semibold text-foreground">{crop.demand}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Quality</p>
                        <p className="font-semibold text-foreground">{crop.quality}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
