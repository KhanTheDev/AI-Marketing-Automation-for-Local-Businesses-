"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Settings, CreditCard, Bell, Shield, Download, Trash2, Crown, Zap } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

interface UserProfile {
  name: string
  email: string
  company: string
  role: string
  phone: string
  bio: string
  avatar: string
  plan: "free" | "pro" | "enterprise"
  joinDate: string
}

interface NotificationSettings {
  emailMarketing: boolean
  emailReports: boolean
  emailSecurity: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
}

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Smith",
    email: "john@company.com",
    company: "Tech Innovations Inc",
    role: "Marketing Director",
    phone: "+1 (555) 123-4567",
    bio: "Passionate about leveraging AI to drive marketing success and business growth.",
    avatar: "/placeholder.svg?height=100&width=100",
    plan: "pro",
    joinDate: "2024-01-15",
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailMarketing: true,
    emailReports: true,
    emailSecurity: true,
    pushNotifications: false,
    weeklyDigest: true,
  })

  const [businessData, setBusinessData] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem("businessData")
    if (stored) {
      setBusinessData(JSON.parse(stored))
    }
  }, [])

  const handleProfileUpdate = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile))
    alert("Profile updated successfully!")
  }

  const handleNotificationUpdate = () => {
    localStorage.setItem("notificationSettings", JSON.stringify(notifications))
    alert("Notification settings updated!")
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "free":
        return <Badge variant="outline">Free Plan</Badge>
      case "pro":
        return <Badge className="bg-indigo-600">Pro Plan</Badge>
      case "enterprise":
        return <Badge className="bg-purple-600">Enterprise</Badge>
      default:
        return <Badge variant="outline">Free Plan</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center space-x-4">
            <Logo size="md" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-600">Manage your MarketMAte account and preferences</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and profile settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={profile.avatar || "/placeholder.svg"}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{profile.name}</h3>
                    <p className="text-gray-600">{profile.email}</p>
                    {getPlanBadge(profile.plan)}
                  </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button onClick={handleProfileUpdate}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Tab */}
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Your business details used for AI personalization</CardDescription>
              </CardHeader>
              <CardContent>
                {businessData ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Business Name</Label>
                        <p className="font-medium">{businessData.businessName}</p>
                      </div>
                      <div>
                        <Label>Industry</Label>
                        <p className="font-medium">{businessData.industry}</p>
                      </div>
                      <div>
                        <Label>Location</Label>
                        <p className="font-medium">{businessData.location || "Not specified"}</p>
                      </div>
                      <div>
                        <Label>Website</Label>
                        <p className="font-medium">{businessData.website || "Not specified"}</p>
                      </div>
                    </div>
                    <div>
                      <Label>Services/Products</Label>
                      <p className="text-sm text-gray-600 mt-1">{businessData.services}</p>
                    </div>
                    <div>
                      <Label>Target Audience</Label>
                      <p className="text-sm text-gray-600 mt-1">{businessData.audience || "Not specified"}</p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/business-intake">Update Business Info</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No business information found</p>
                    <Button asChild>
                      <Link href="/business-intake">Complete Business Setup</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        Pro Plan
                        <Crown className="h-5 w-5 ml-2 text-yellow-500" />
                      </h3>
                      <p className="text-gray-600">$49/month • Billed monthly</p>
                    </div>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-indigo-600">∞</p>
                      <p className="text-sm text-gray-600">AI Generations</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-indigo-600">10</p>
                      <p className="text-sm text-gray-600">Social Accounts</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-indigo-600">$1000</p>
                      <p className="text-sm text-gray-600">Monthly Ad Spend</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline">View Usage</Button>
                    <Button variant="outline">Download Invoice</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upgrade to Enterprise</CardTitle>
                  <CardDescription>Get unlimited everything plus priority support</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Enterprise Plan</h4>
                      <p className="text-sm text-gray-600">Custom pricing • White-label options</p>
                    </div>
                    <Button>
                      <Zap className="h-4 w-4 mr-2" />
                      Contact Sales
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about your account activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailMarketing">Marketing Updates</Label>
                      <p className="text-sm text-gray-600">Product updates, tips, and marketing insights</p>
                    </div>
                    <Switch
                      id="emailMarketing"
                      checked={notifications.emailMarketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailMarketing: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailReports">Performance Reports</Label>
                      <p className="text-sm text-gray-600">Weekly and monthly performance summaries</p>
                    </div>
                    <Switch
                      id="emailReports"
                      checked={notifications.emailReports}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailReports: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailSecurity">Security Alerts</Label>
                      <p className="text-sm text-gray-600">Login attempts and security notifications</p>
                    </div>
                    <Switch
                      id="emailSecurity"
                      checked={notifications.emailSecurity}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailSecurity: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <p className="text-sm text-gray-600">Real-time notifications in your browser</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                      <p className="text-sm text-gray-600">Summary of your week's activity and insights</p>
                    </div>
                    <Switch
                      id="weeklyDigest"
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                    />
                  </div>
                </div>

                <Button onClick={handleNotificationUpdate}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security and privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Active Sessions</h4>
                      <p className="text-sm text-gray-600">Manage your active login sessions</p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions that affect your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-600">Export Data</h4>
                      <p className="text-sm text-gray-600">Download all your account data</p>
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-600">Delete Account</h4>
                      <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
