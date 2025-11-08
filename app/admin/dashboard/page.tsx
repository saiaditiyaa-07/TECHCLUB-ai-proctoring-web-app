"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, BarChart3, Users, LogOut, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface Test {
  id: string
  name: string
  subject: string
  startDate: string
  endDate: string
  duration: number
  totalQuestions: number
  status: "active" | "upcoming" | "completed"
  assignedStudents: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [tests, setTests] = useState<Test[]>([
    {
      id: "1",
      name: "Mathematics Final Exam",
      subject: "Mathematics",
      startDate: "2024-11-20",
      endDate: "2024-11-20",
      duration: 120,
      totalQuestions: 50,
      status: "active",
      assignedStudents: 45,
    },
    {
      id: "2",
      name: "Physics Midterm",
      subject: "Physics",
      startDate: "2024-11-25",
      endDate: "2024-11-25",
      duration: 90,
      totalQuestions: 40,
      status: "upcoming",
      assignedStudents: 52,
    },
  ])
  const [activeTab, setActiveTab] = useState("tests")

  const handleLogout = () => {
    router.push("/")
  }

  const handleCreateTest = () => {
    router.push("/admin/create-test")
  }

  const handleViewAnalytics = (testId: string) => {
    router.push(`/admin/analytics/${testId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "upcoming":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "completed":
        return "bg-slate-500/10 text-slate-500 border-slate-500/20"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-700 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} z-40 md:translate-x-0`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">ExamGuard</h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-2 px-4">
          <button
            onClick={() => setActiveTab("tests")}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              activeTab === "tests" ? "bg-blue-600" : "hover:bg-slate-800"
            }`}
          >
            Tests
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              activeTab === "students" ? "bg-blue-600" : "hover:bg-slate-800"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              activeTab === "analytics" ? "bg-blue-600" : "hover:bg-slate-800"
            }`}
          >
            Analytics
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-slate-600 flex gap-2 bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? "md:ml-64" : ""} transition-all`}>
        {/* Top Bar */}
        <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-slate-800 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            </div>
            <div className="text-sm text-slate-400">Admin Account</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "tests" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Manage Tests</h3>
                <Button onClick={handleCreateTest} className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Plus className="w-4 h-4" />
                  Create Test
                </Button>
              </div>

              <div className="grid gap-4">
                {tests.map((test) => (
                  <Card
                    key={test.id}
                    className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800/80 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-2">{test.name}</h4>
                        <div className="flex gap-4 text-sm text-slate-400">
                          <span>Subject: {test.subject}</span>
                          <span>Questions: {test.totalQuestions}</span>
                          <span>Duration: {test.duration} min</span>
                          <span>Students: {test.assignedStudents}</span>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(test.status)}`}
                      >
                        {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 bg-transparent"
                        onClick={() => router.push(`/admin/edit-test/${test.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 bg-transparent"
                        onClick={() => router.push(`/admin/assign-test/${test.id}`)}
                      >
                        Assign
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 bg-transparent"
                        onClick={() => handleViewAnalytics(test.id)}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div>
              <h3 className="text-xl font-bold mb-6">Manage Students</h3>
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="text-slate-400">
                  <Users className="w-12 h-12 mb-4" />
                  <p>Student management features coming soon</p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "analytics" && (
            <div>
              <h3 className="text-xl font-bold mb-6">Analytics Overview</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <div className="text-sm text-slate-400 mb-2">Total Tests</div>
                  <div className="text-3xl font-bold">{tests.length}</div>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <div className="text-sm text-slate-400 mb-2">Total Students</div>
                  <div className="text-3xl font-bold">{tests.reduce((sum, t) => sum + t.assignedStudents, 0)}</div>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <div className="text-sm text-slate-400 mb-2">Active Tests</div>
                  <div className="text-3xl font-bold text-green-500">
                    {tests.filter((t) => t.status === "active").length}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
