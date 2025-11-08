"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download, AlertTriangle, TrendingUp, Users, Clock } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface ViolationDetail {
  type: string
  count: number
  severity: "high" | "medium" | "low"
  description: string
}

interface StudentResult {
  id: string
  name: string
  email: string
  score: number
  maxScore: number
  violations: number
  status: "completed" | "terminated" | "incomplete"
  timeSpent: number
  violationDetails: ViolationDetail[]
  flagged: boolean
}

export default function AnalyticsPage() {
  const params = useParams()
  const testId = params.testId

  const [results] = useState<StudentResult[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      score: 85,
      maxScore: 100,
      violations: 0,
      status: "completed",
      timeSpent: 95,
      violationDetails: [],
      flagged: false,
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane@example.com",
      score: 72,
      maxScore: 100,
      violations: 2,
      status: "completed",
      timeSpent: 115,
      violationDetails: [
        { type: "Tab Switch", count: 2, severity: "medium", description: "Switched to another tab 2 times" },
      ],
      flagged: true,
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      score: 0,
      maxScore: 100,
      violations: 3,
      status: "terminated",
      timeSpent: 45,
      violationDetails: [
        { type: "Multiple Faces", count: 1, severity: "high", description: "Detected 2 faces in frame" },
        { type: "Phone Detected", count: 1, severity: "high", description: "Mobile device detected on desk" },
        {
          type: "Suspicious Glance",
          count: 1,
          severity: "medium",
          description: "Excessive eye movement away from screen",
        },
      ],
      flagged: true,
    },
    {
      id: "4",
      name: "Alice Williams",
      email: "alice@example.com",
      score: 92,
      maxScore: 100,
      violations: 0,
      status: "completed",
      timeSpent: 110,
      violationDetails: [],
      flagged: false,
    },
    {
      id: "5",
      name: "Charlie Brown",
      email: "charlie@example.com",
      score: 68,
      maxScore: 100,
      violations: 1,
      status: "completed",
      timeSpent: 120,
      violationDetails: [
        { type: "Background Noise", count: 1, severity: "low", description: "High background noise detected" },
      ],
      flagged: false,
    },
  ])

  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "terminated">("all")
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false)
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)

  const filteredResults = results.filter((r) => {
    const statusMatch = filterStatus === "all" || r.status === filterStatus
    const flagMatch = !showFlaggedOnly || r.flagged
    return statusMatch && flagMatch
  })

  const averageScore = (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)
  const passRate = ((results.filter((r) => r.score >= 60).length / results.length) * 100).toFixed(1)
  const flaggedCount = results.filter((r) => r.flagged).length
  const terminatedCount = results.filter((r) => r.status === "terminated").length

  const violationStats = {
    totalViolations: results.reduce((sum, r) => sum + r.violations, 0),
    averageViolations: (results.reduce((sum, r) => sum + r.violations, 0) / results.length).toFixed(2),
    highSeverityCount: results.filter((r) => r.violationDetails.some((v) => v.severity === "high")).length,
    mostCommonViolation: getMostCommonViolation(results),
  }

  function getMostCommonViolation(studentResults: StudentResult[]): string {
    const violationCounts: Record<string, number> = {}
    studentResults.forEach((r) => {
      r.violationDetails.forEach((v) => {
        violationCounts[v.type] = (violationCounts[v.type] || 0) + v.count
      })
    })
    return Object.entries(violationCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "None"
  }

  const handleExportPDF = () => {
    alert("PDF export functionality - In production, this would generate and download a comprehensive PDF report")
  }

  const handleExportCSV = () => {
    alert("CSV export functionality - In production, this would export all data to CSV format")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <Link href="/admin/dashboard" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Test Analytics & Violation Reports</h2>
            <p className="text-slate-400">Test ID: {testId}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Download className="w-4 h-4" />
              PDF Report
            </Button>
            <Button onClick={handleExportCSV} variant="outline" className="border-slate-600 gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              CSV Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-2">Total Students</div>
                <div className="text-3xl font-bold">{results.length}</div>
              </div>
              <Users className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-2">Average Score</div>
                <div className="text-3xl font-bold">{averageScore}%</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-2">Pass Rate</div>
                <div className="text-3xl font-bold text-green-500">{passRate}%</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-2">Flagged Students</div>
                <div className="text-3xl font-bold text-yellow-500">{flaggedCount}</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500 opacity-20" />
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="text-sm text-slate-400 mb-2">Total Violations</div>
            <div className="text-3xl font-bold text-red-500">{violationStats.totalViolations}</div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="text-sm text-slate-400 mb-2">Avg Violations/Student</div>
            <div className="text-3xl font-bold">{violationStats.averageViolations}</div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="text-sm text-slate-400 mb-2">High Severity Cases</div>
            <div className="text-3xl font-bold text-red-500">{violationStats.highSeverityCount}</div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="text-sm text-slate-400 mb-2">Most Common Violation</div>
            <div className="text-lg font-bold text-orange-500 truncate">{violationStats.mostCommonViolation}</div>
          </Card>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              filterStatus === "all" ? "bg-blue-600" : "bg-slate-700/50 hover:bg-slate-700"
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              filterStatus === "completed" ? "bg-blue-600" : "bg-slate-700/50 hover:bg-slate-700"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilterStatus("terminated")}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              filterStatus === "terminated" ? "bg-blue-600" : "bg-slate-700/50 hover:bg-slate-700"
            }`}
          >
            Terminated ({terminatedCount})
          </button>
          <div className="flex-1"></div>
          <button
            onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
            className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
              showFlaggedOnly ? "bg-yellow-600" : "bg-slate-700/50 hover:bg-slate-700"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Flagged Only
          </button>
        </div>

        {/* Results Table */}
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700 bg-slate-900/50">
                <tr>
                  <th className="text-left p-4">Student Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-right p-4">Score</th>
                  <th className="text-center p-4">Time</th>
                  <th className="text-center p-4">Violations</th>
                  <th className="text-center p-4">Status</th>
                  <th className="text-center p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {result.flagged && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                        {result.name}
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{result.email}</td>
                    <td className="p-4 text-right font-semibold">
                      <span className={result.score >= 60 ? "text-green-500" : "text-red-500"}>
                        {result.score}/{result.maxScore}
                      </span>
                    </td>
                    <td className="p-4 text-center text-slate-400 flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" />
                      {result.timeSpent}m
                    </td>
                    <td className="p-4 text-center">
                      {result.violations > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          {result.violations}
                        </span>
                      ) : (
                        <span className="text-green-500 text-xs">None</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          result.status === "completed"
                            ? "bg-green-500/10 text-green-500"
                            : result.status === "terminated"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-slate-500/10 text-slate-500"
                        }`}
                      >
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setExpandedStudent(expandedStudent === result.id ? null : result.id)}
                        className="text-blue-400 hover:text-blue-300 text-xs font-semibold"
                      >
                        {expandedStudent === result.id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {expandedStudent && (
          <Card className="bg-slate-800/50 border-slate-700 p-6 mb-8">
            <h3 className="text-lg font-bold mb-6">
              Detailed Report - {filteredResults.find((r) => r.id === expandedStudent)?.name}
            </h3>

            <div className="space-y-6">
              {filteredResults.find((r) => r.id === expandedStudent)?.violationDetails &&
              filteredResults.find((r) => r.id === expandedStudent)!.violationDetails.length > 0 ? (
                filteredResults
                  .find((r) => r.id === expandedStudent)
                  ?.violationDetails.map((violation, idx) => (
                    <div key={idx} className="bg-slate-700/30 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white">{violation.type}</h4>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            violation.severity === "high"
                              ? "bg-red-500/10 text-red-500"
                              : violation.severity === "medium"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{violation.description}</p>
                      <p className="text-xs text-slate-500">Occurrences: {violation.count}</p>
                    </div>
                  ))
              ) : (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-green-500 text-sm">No violations detected</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Violation Summary by Type */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h3 className="text-lg font-bold mb-6">Violation Summary</h3>
          <div className="space-y-4">
            {(() => {
              const violationsByType: Record<string, { count: number; severity: string }> = {}
              results.forEach((r) => {
                r.violationDetails.forEach((v) => {
                  if (!violationsByType[v.type]) {
                    violationsByType[v.type] = { count: 0, severity: v.severity }
                  }
                  violationsByType[v.type].count += v.count
                })
              })

              return Object.entries(violationsByType).map(([type, data]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-white">{type}</p>
                    <p className="text-xs text-slate-400">Total occurrences</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-500">{data.count}</div>
                  </div>
                </div>
              ))
            })()}
          </div>
        </Card>
      </div>
    </div>
  )
}
