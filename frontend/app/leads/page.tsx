"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  UserPlus,
  BarChart3,
  Loader2,
  Eye,
  Mail,
  Phone,
  Calendar,
  Clock,
  ArrowUpDown,
} from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

interface Lead {
  id: string
  visitorId: string
  businessId: string
  firstPage: string
  pageViews: number
  source: string
  medium: string
  campaign: string
  createdAt: string
  lastActive: string
  actions: number
  converted: boolean
  email: string | null
  score: number
}

export default function LeadsPage() {
  const [businessData, setBusinessData] = useState<any>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortField, setSortField] = useState<string>("score")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filterSource, setFilterSource] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    const stored = localStorage.getItem("businessData")
    if (stored) {
      setBusinessData(JSON.parse(stored))
    }

    fetchLeads()
  }, [currentPage, sortField, sortDirection, filterSource, filterStatus])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/leads?page=${currentPage}&limit=10`)
      const data = await response.json()

      if (data.leads) {
        let filteredLeads = [...data.leads]

        // Apply source filter
        if (filterSource !== "all") {
          filteredLeads = filteredLeads.filter((lead) => lead.source === filterSource)
        }

        // Apply status filter
        if (filterStatus !== "all") {
          const isConverted = filterStatus === "converted"
          filteredLeads = filteredLeads.filter((lead) => lead.converted === isConverted)
        }

        // Apply search
        if (searchTerm) {
          filteredLeads = filteredLeads.filter(
            (lead) => lead.id.includes(searchTerm) || (lead.email && lead.email.includes(searchTerm)),
          )
        }

        // Apply sorting
        filteredLeads.sort((a, b) => {
          let comparison = 0

          if (sortField === "score") {
            comparison = a.score - b.score
          } else if (sortField === "pageViews") {
            comparison = a.pageViews - b.pageViews
          } else if (sortField === "lastActive") {
            comparison = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()
          } else if (sortField === "createdAt") {
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          }

          return sortDirection === "asc" ? comparison : -comparison
        })

        setLeads(filteredLeads)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error("Error fetching leads:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchLeads()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const getLeadScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-600">High ({score})</Badge>
    if (score >= 50) return <Badge className="bg-yellow-600">Medium ({score})</Badge>
    return <Badge variant="outline">Low ({score})</Badge>
  }

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case "google":
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )
      case "facebook":
        return (
          <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
          </svg>
        )
      case "linkedin":
        return (
          <svg className="h-4 w-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
          </svg>
        )
      case "email":
        return <Mail className="h-4 w-4 text-purple-600" />
      case "referral":
        return (
          <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
          </svg>
        )
      default:
        return (
          <svg className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
            <path d="M11 11h2v6h-2zm0-4h2v2h-2z" />
          </svg>
        )
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
              <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
              <p className="text-gray-600">Track, analyze, and convert website visitors into customers</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold">{leads.length}</p>
                </div>
                <UserPlus className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High-Quality Leads</p>
                  <p className="text-2xl font-bold">{leads.filter((lead) => lead.score >= 80).length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold">
                    {leads.length
                      ? `${Math.round((leads.filter((lead) => lead.converted).length / leads.length) * 100)}%`
                      : "0%"}
                  </p>
                </div>
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Lead Score</p>
                  <p className="text-2xl font-bold">
                    {leads.length ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length) : "0"}
                  </p>
                </div>
                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <TabsList className="md:w-auto">
              <TabsTrigger value="all">All Leads</TabsTrigger>
              <TabsTrigger value="high">High Quality</TabsTrigger>
              <TabsTrigger value="new">New (24h)</TabsTrigger>
              <TabsTrigger value="converted">Converted</TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-2">
              <form onSubmit={handleSearch} className="flex w-full md:w-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search leads..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" className="ml-2">
                  Search
                </Button>
              </form>

              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Source</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("pageViews")}>
                          <div className="flex items-center">
                            Page Views
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("lastActive")}>
                          <div className="flex items-center">
                            Last Active
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("score")}>
                          <div className="flex items-center">
                            Lead Score
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex justify-center">
                              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Loading leads...</p>
                          </TableCell>
                        </TableRow>
                      ) : leads.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-gray-500">No leads found</p>
                            <Button variant="outline" className="mt-4">
                              <UserPlus className="mr-2 h-4 w-4" />
                              Add Lead Manually
                            </Button>
                          </TableCell>
                        </TableRow>
                      ) : (
                        leads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.id.substring(0, 8)}...</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getSourceIcon(lead.source)}
                                <span className="ml-2 capitalize">{lead.source}</span>
                              </div>
                            </TableCell>
                            <TableCell>{lead.pageViews}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="flex items-center text-sm">
                                  <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                                  {formatDate(lead.lastActive)}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTime(lead.lastActive)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getLeadScoreBadge(lead.score)}</TableCell>
                            <TableCell>
                              {lead.converted ? (
                                <Badge className="bg-green-600">Converted</Badge>
                              ) : (
                                <Badge variant="outline">Prospect</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {lead.email ? (
                                  <Button variant="ghost" size="icon">
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button variant="ghost" size="icon" disabled>
                                    <Mail className="h-4 w-4 text-gray-300" />
                                  </Button>
                                )}
                                <Button variant="ghost" size="icon">
                                  <Phone className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="py-4 border-t">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1) setCurrentPage(currentPage - 1)
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(page)
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                            }}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="high" className="space-y-4">
            {/* High quality leads content - filtered version of the main table */}
            <Card>
              <CardHeader>
                <CardTitle>High-Quality Leads</CardTitle>
                <CardDescription>Leads with a score of 80 or higher</CardDescription>
              </CardHeader>
              <CardContent>{/* Similar table as above but filtered for high-quality leads */}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            {/* New leads content */}
            <Card>
              <CardHeader>
                <CardTitle>New Leads (Last 24 Hours)</CardTitle>
                <CardDescription>Recently captured leads that need attention</CardDescription>
              </CardHeader>
              <CardContent>{/* Similar table as above but filtered for new leads */}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="converted" className="space-y-4">
            {/* Converted leads content */}
            <Card>
              <CardHeader>
                <CardTitle>Converted Leads</CardTitle>
                <CardDescription>Leads that have completed a conversion action</CardDescription>
              </CardHeader>
              <CardContent>{/* Similar table as above but filtered for converted leads */}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
