"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

interface Question {
  id: string
  text: string
  type: "mcq" | "short"
  options?: string[]
  correctAnswer?: string | number
}

export default function EditTestPage() {
  const router = useRouter()
  const params = useParams()
  const testId = params.testId

  const [step, setStep] = useState(1)
  const [testInfo, setTestInfo] = useState({
    name: "Mathematics Final Exam",
    subject: "Mathematics",
    startDate: "2024-11-20",
    endDate: "2024-11-20",
    duration: 120,
  })
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "What is 2+2?",
      type: "mcq",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1,
    },
  ])
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    type: "mcq" as const,
    options: ["", "", "", ""],
    correctAnswer: 0,
  })

  const handleTestInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTestInfo((prev) => ({ ...prev, [name]: name === "duration" ? Number.parseInt(value) : value }))
  }

  const addQuestion = () => {
    if (currentQuestion.text.trim()) {
      const newQuestion: Question = {
        id: Date.now().toString(),
        text: currentQuestion.text,
        type: currentQuestion.type,
        ...(currentQuestion.type === "mcq" && {
          options: currentQuestion.options.filter((o) => o.trim()),
          correctAnswer: currentQuestion.correctAnswer,
        }),
      }
      setQuestions([...questions, newQuestion])
      setCurrentQuestion({
        text: "",
        type: "mcq",
        options: ["", "", "", ""],
        correctAnswer: 0,
      })
    }
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleSaveChanges = async () => {
    if (!testInfo.name || questions.length === 0) {
      alert("Please fill in all required fields")
      return
    }
    // Simulate API call
    alert("Test updated successfully")
    router.push("/admin/dashboard")
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <Card className="bg-slate-800/50 border-slate-700 p-8 max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Edit Test</h2>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Test Name</label>
              <Input
                type="text"
                name="name"
                value={testInfo.name}
                onChange={handleTestInfoChange}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
              <Input
                type="text"
                name="subject"
                value={testInfo.subject}
                onChange={handleTestInfoChange}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  value={testInfo.startDate}
                  onChange={handleTestInfoChange}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  value={testInfo.endDate}
                  onChange={handleTestInfoChange}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Duration (minutes)</label>
              <Input
                type="number"
                name="duration"
                value={testInfo.duration}
                onChange={handleTestInfoChange}
                min="30"
                max="480"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </div>

          <Button onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700">
            Next: Edit Questions
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <Link href="/admin/dashboard" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="max-w-4xl">
        <Card className="bg-slate-800/50 border-slate-700 p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Edit Questions: {testInfo.name}</h2>
          <p className="text-slate-400 mb-6">Total Questions: {questions.length}</p>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Question Text</label>
              <textarea
                value={currentQuestion.text}
                onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, text: e.target.value }))}
                placeholder="Enter the question"
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg p-3 placeholder-slate-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Question Type</label>
              <select
                value={currentQuestion.type}
                onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, type: e.target.value as any }))}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg p-2"
              >
                <option value="mcq">Multiple Choice</option>
                <option value="short">Short Answer</option>
              </select>
            </div>

            {currentQuestion.type === "mcq" && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Options</label>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="radio"
                        name="correct"
                        checked={currentQuestion.correctAnswer === idx}
                        onChange={() => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: idx }))}
                        className="mt-3"
                      />
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...currentQuestion.options]
                          newOptions[idx] = e.target.value
                          setCurrentQuestion((prev) => ({ ...prev, options: newOptions }))
                        }}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button onClick={addQuestion} className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </Card>

        {questions.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <h3 className="text-lg font-bold mb-4">Questions ({questions.length})</h3>
            <div className="space-y-3 mb-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-slate-700/30 rounded-lg p-4 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold mb-1">
                      Q{idx + 1}: {q.text}
                    </p>
                    {q.type === "mcq" && q.options && (
                      <div className="text-xs text-slate-400">Options: {q.options.join(", ")}</div>
                    )}
                  </div>
                  <button onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1 border-slate-600">
                Back
              </Button>
              <Button onClick={handleSaveChanges} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
