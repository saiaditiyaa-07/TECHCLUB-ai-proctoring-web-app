"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, Play, Clock, FileText, Filter } from "lucide-react"
import { useRouter } from "next/navigation"

interface Test {
  id: string
  name: string
  subject: string
  dueDate: string
  duration: number
  totalQuestions: number
  status: "pending" | "in-progress" | "completed"
  submittedAt?: string
  score?: number
}

export default function StudentDashboard() {
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all")
  const [tests] = useState<Test[]>([
    {
      id: "1",
      name: "Mathematics Final Exam",
      subject: "Mathematics",
      dueDate: "2024-11-20",
      duration: 120,
      totalQuestions: 50,
      status: "completed",
      submittedAt: "2024-11-19",
      score: 85,
    },
    {
      id: "2",
      name: "Physics Midterm",
      subject: "Physics",
      dueDate: "2024-11-25",
      duration: 90,
      totalQuestions: 40,
      status: "pending",
    },
    {
      id: "3",
      name: "Chemistry Quiz",
      subject: "Chemistry",
      dueDate: "2024-11-28",
      duration: 60,
      totalQuestions: 30,
      status: "pending",
    },
  ])

  const handleLogout = () => {
    router.push("/")
  }

  const handleStartTest = (testId: string) => {
    router.push(`/student/exam/${testId}`)
  }

  const filteredTests = tests.filter((test) => (filterStatus === "all" ? true : test.status === filterStatus))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 border border-green-500/20"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">John Doe</span>
            <Button onClick={handleLogout} variant="outline" className="border-slate-600 flex gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Tests</h2>
          <p className="text-slate-400">Complete your assigned proctored exams</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === "all" ? "bg-blue-600" : "bg-slate-700/50 hover:bg-slate-700"}`}
          >
            <Filter className="w-4 h-4 inline mr-2" />
            All Tests
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === "pending" ? "bg-blue-600" : "bg-slate-700/50 hover:bg-slate-700"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === "completed" ? "bg-blue-600" : "bg-slate-700/50 hover:bg-slate-700"}`}
          >
            Completed
          </button>
        </div>

        <div className="grid gap-6">
          {filteredTests.map((test) => (
            <Card
              key={test.id}
              className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{test.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {test.subject}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {test.duration} minutes
                    </div>
                    <div>Questions: {test.totalQuestions}</div>
                    <div>Due: {new Date(test.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(test.status)}`}>
                  {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                </div>
              </div>

              {test.status === "completed" && test.score !== undefined && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="text-sm text-slate-400">Your Score</div>
                  <div className="text-2xl font-bold text-green-500">{test.score}%</div>
                </div>
              )}

              <Button
                onClick={() => handleStartTest(test.id)}
                disabled={test.status === "completed"}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Play className="w-4 h-4" />
                {test.status === "completed" ? "Already Completed" : "Start Test"}
              </Button>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
            <p className="text-slate-400 mb-4">
              {filterStatus === "all"
                ? "No tests assigned yet"
                : filterStatus === "pending"
                  ? "No pending tests"
                  : "No completed tests"}
            </p>
            <p className="text-sm text-slate-500">Check back later for assigned exams</p>
          </Card>
        )}
      </main>
    </div>
  )
}
