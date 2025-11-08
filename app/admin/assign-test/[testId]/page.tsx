"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

interface Student {
  id: string
  name: string
  email: string
  selected: boolean
}

export default function AssignTestPage() {
  const router = useRouter()
  const params = useParams()
  const testId = params.testId

  const [searchQuery, setSearchQuery] = useState("")
  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "John Smith", email: "john@example.com", selected: false },
    { id: "2", name: "Jane Doe", email: "jane@example.com", selected: false },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", selected: false },
    { id: "4", name: "Alice Williams", email: "alice@example.com", selected: false },
    { id: "5", name: "Charlie Brown", email: "charlie@example.com", selected: false },
  ])

  const [assignmentDates, setAssignmentDates] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  })

  const filteredStudents = students.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.includes(searchQuery),
  )

  const selectedCount = students.filter((s) => s.selected).length

  const handleSelectStudent = (studentId: string) => {
    setStudents(students.map((s) => (s.id === studentId ? { ...s, selected: !s.selected } : s)))
  }

  const handleSelectAll = () => {
    const allSelected = filteredStudents.every((s) => s.selected)
    setStudents(
      students.map((s) => ({
        ...s,
        selected: filteredStudents.includes(s) ? !allSelected : s.selected,
      })),
    )
  }

  const handleAssignTest = async () => {
    if (selectedCount === 0) {
      alert("Please select at least one student")
      return
    }

    if (!assignmentDates.endDate) {
      alert("Please set an end date")
      return
    }

    // Simulate API call
    console.log(
      "Assigning test to students:",
      students.filter((s) => s.selected),
    )
    alert(`Test assigned to ${selectedCount} student${selectedCount > 1 ? "s" : ""}`)
    router.push("/admin/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <Link href="/admin/dashboard" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="max-w-4xl">
        <Card className="bg-slate-800/50 border-slate-700 p-8 mb-6">
          <h2 className="text-2xl font-bold mb-2">Assign Test to Students</h2>
          <p className="text-slate-400">Test ID: {testId}</p>

          <div className="mt-6 space-y-4 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                <Input
                  type="date"
                  value={assignmentDates.startDate}
                  onChange={(e) => setAssignmentDates({ ...assignmentDates, startDate: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">End Date (Due)</label>
                <Input
                  type="date"
                  value={assignmentDates.endDate}
                  onChange={(e) => setAssignmentDates({ ...assignmentDates, endDate: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
            <div className="text-sm text-slate-300">
              <p className="font-semibold mb-1">Assignment Summary</p>
              <p className="text-slate-400">
                {selectedCount} student{selectedCount !== 1 ? "s" : ""} selected out of {students.length}
              </p>
            </div>
          </div>

          <Button onClick={handleAssignTest} className="w-full bg-blue-600 hover:bg-blue-700">
            <Check className="w-4 h-4 mr-2" />
            Assign Test to {selectedCount} Student{selectedCount !== 1 ? "s" : ""}
          </Button>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Select Students</h3>
            <button onClick={handleSelectAll} className="text-sm text-blue-400 hover:text-blue-300 underline">
              {filteredStudents.every((s) => s.selected) ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredStudents.map((student) => (
              <label
                key={student.id}
                className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={student.selected}
                  onChange={() => handleSelectStudent(student.id)}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-slate-400">{student.email}</div>
                </div>
                {student.selected && <Check className="w-4 h-4 text-green-500" />}
              </label>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
