import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Bot, BarChart3, Mail, Share2, User } from "lucide-react"
import { Logo } from "@/components/logo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <Logo size="lg" />
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/account">
                <User className="h-4 w-4 mr-2" />
                Account
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Logo size="lg" variant="icon" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your AI-Powered <span className="text-indigo-600">Marketing Mate</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your business with intelligent lead scoring, automated campaigns, AI-generated content, and smart
            social media management. MarketMAte is your ultimate marketing companion.
          </p>

          <Button size="lg" className="text-lg px-8 py-4" asChild>
            <Link href="/business-intake">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>AI Lead Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Intelligent lead qualification and scoring to prioritize your best prospects automatically
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Mail className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Smart Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automated email and SMS campaigns tailored to your audience and industry
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Share2 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Social Media Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect all your social accounts, publish with one click, and manage ad campaigns seamlessly
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Bot className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>AI Business Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Intelligent chatbot for customer support, lead qualification, and marketing advice
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Brand Story Section */}
        <div className="mt-20 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <Logo size="md" className="justify-center mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Your Marketing Mate</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              MarketMAte combines the power of artificial intelligence with intuitive design to become your trusted
              marketing companion. We understand that every business is unique, which is why our AI learns from your
              specific industry, audience, and goals to deliver personalized marketing solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-2">AI-First Approach</h3>
              <p className="text-sm text-gray-600">
                Every feature is powered by advanced AI to maximize your marketing ROI
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">All-in-One Platform</h3>
              <p className="text-sm text-gray-600">Manage leads, campaigns, social media, and analytics in one place</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Data-Driven Results</h3>
              <p className="text-sm text-gray-600">Make informed decisions with real-time analytics and insights</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-lg text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Meet Your Marketing Mate?</h2>
          <p className="mb-6 opacity-90">
            Join thousands of businesses already using MarketMAte to grow faster and smarter
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/business-intake">
              Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t">
        <div className="flex justify-between items-center">
          <Logo size="sm" />
          <div className="text-center text-gray-600">
            <p>&copy; 2024 MarketMAte. Your AI Marketing Companion.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
