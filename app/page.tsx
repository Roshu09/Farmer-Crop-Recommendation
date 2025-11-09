"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, TrendingUp, BarChart3, Leaf } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sprout className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold text-foreground">CropRecommend</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
              Intelligent Crop Recommendations for Better Harvests
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Get AI-powered crop suggestions based on soil conditions, weather patterns, market prices, and your
              location. Maximize yield and profitability.
            </p>
            <div className="flex gap-3">
              <Link href="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg p-8 min-h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Leaf className="w-24 h-24 text-primary mx-auto" />
              <p className="text-muted-foreground">Agricultural Intelligence Dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Why Choose CropRecommend?</h2>
            <p className="text-muted-foreground text-lg">Everything you need to make data-driven farming decisions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Smart Recommendations",
                desc: "AI-powered suggestions tailored to your farm conditions",
              },
              {
                icon: BarChart3,
                title: "Market Analysis",
                desc: "Real-time crop prices and market trend insights",
              },
              {
                icon: Leaf,
                title: "Soil Monitoring",
                desc: "Track soil health metrics and recommendations",
              },
              {
                icon: Sprout,
                title: "Weather Integration",
                desc: "Accurate weather forecasts for optimal planning",
              },
            ].map((feature) => (
              <Card key={feature.title} className="bg-background hover:shadow-md transition-shadow">
                <CardHeader>
                  <feature.icon className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Optimize Your Harvest?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of farmers using CropRecommend to increase yields and reduce costs.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Start Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/20 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="w-5 h-5 text-primary" />
                <span className="font-bold">CropRecommend</span>
              </div>
              <p className="text-sm text-muted-foreground">Intelligent crop recommendations for sustainable farming.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Support", links: ["Help Center", "Contact", "Docs"] },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="font-semibold mb-3">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CropRecommend. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
