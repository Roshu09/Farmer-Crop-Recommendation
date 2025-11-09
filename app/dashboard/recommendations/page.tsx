"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Loader, TrendingUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Recommendation {
  id: string
  cropName: string
  suitability: number
  reason: string
  benefits: string[]
  riskFactors: string[]
  estimatedYield: string
  marketPrice: number
}

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchRecommendations()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = recommendations.filter((rec) => rec.cropName.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredRecommendations(filtered)
    } else {
      setFilteredRecommendations(recommendations)
    }
  }, [searchQuery, recommendations])

  const fetchRecommendations = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/recommendations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!response.ok) throw new Error("Failed to fetch recommendations")

      const data = await response.json()
      setRecommendations(data.recommendations)
      setFilteredRecommendations(data.recommendations)
    } catch (err) {
      setError("Failed to load recommendations")
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
            <h1 className="text-3xl font-bold text-foreground">Crop Recommendations</h1>
            <p className="text-muted-foreground">AI-powered suggestions tailored to your farm conditions</p>
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
          <>
            {filteredRecommendations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "No crops found matching your search."
                      : "No recommendations available yet. Please update your farm data."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRecommendations.map((rec) => (
                  <Card key={rec.id} className="hover:shadow-md transition-shadow overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{rec.cropName}</CardTitle>
                          <CardDescription>{rec.reason}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{rec.suitability}%</div>
                          <div className="text-xs text-muted-foreground">Suitability</div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Suitability Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Suitability Score</span>
                          <span className="text-muted-foreground">{rec.suitability}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all"
                            style={{ width: `${rec.suitability}%` }}
                          />
                        </div>
                      </div>

                      {/* Benefits */}
                      {rec.benefits.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Benefits
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {rec.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-muted-foreground">
                                • {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Risk Factors */}
                      {rec.riskFactors.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            Risk Factors
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {rec.riskFactors.map((risk, idx) => (
                              <li key={idx} className="text-muted-foreground">
                                • {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Estimated Yield</p>
                          <p className="font-semibold text-foreground">{rec.estimatedYield}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Market Price</p>
                          <p className="font-semibold text-foreground flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-primary" />₹{rec.marketPrice}/kg
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                          Plan Cultivation
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
