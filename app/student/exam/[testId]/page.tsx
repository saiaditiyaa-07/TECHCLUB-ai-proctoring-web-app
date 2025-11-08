"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, AlertCircle } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

interface Question {
  id: string
  text: string
  options?: string[]
  type: "mcq" | "short"
}

interface MonitoringStats {
  facesDetected: number
  eyeGazeWarnings: number
  phoneDetected: boolean
  backgroundNoise: boolean
  focusLost: number
}

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [violations, setViolations] = useState(0)
  const [monitoringStats, setMonitoringStats] = useState<MonitoringStats>({
    facesDetected: 1,
    eyeGazeWarnings: 0,
    phoneDetected: false,
    backgroundNoise: false,
    focusLost: 0,
  })
  const [timeLeft, setTimeLeft] = useState(7200)
  const [questions] = useState<Question[]>([
    { id: "1", text: "What is 2+2?", type: "mcq", options: ["3", "4", "5", "6"] },
    { id: "2", text: "What is the capital of France?", type: "mcq", options: ["London", "Berlin", "Paris", "Madrid"] },
    { id: "3", text: "Explain photosynthesis", type: "short" },
  ])
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [videoActive, setVideoActive] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [showConfirmStart, setShowConfirmStart] = useState(true)
  const [aiMonitoringActive, setAiMonitoringActive] = useState(false)

  const currentQuestion = questions[currentQuestionIdx]

  // Start camera
  useEffect(() => {
    if (testStarted && videoRef.current) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: true,
          })
          videoRef.current!.srcObject = stream
          setVideoActive(true)
          setAiMonitoringActive(true)
        } catch (err) {
          console.error("Camera access denied:", err)
          alert("Camera access is required for exam proctoring")
          handleTerminateTest()
        }
      }
      startCamera()

      return () => {
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
          tracks.forEach((track) => track.stop())
        }
      }
    }
  }, [testStarted])

  useEffect(() => {
    if (!aiMonitoringActive || !videoRef.current) return

    const monitoringInterval = setInterval(async () => {
      // Simulate AI detection of various violations
      // In production, this would integrate with actual face detection APIs

      // Simulate occasional face detection issues
      if (Math.random() > 0.95) {
        setMonitoringStats((prev) => ({
          ...prev,
          facesDetected: Math.random() > 0.5 ? 2 : 0, // Simulate multiple faces or no face
        }))

        if (Math.random() > 0.7) {
          setViolations((prev) => {
            const newViolations = prev + 1
            if (newViolations >= 3) {
              handleTerminateTest()
            }
            return newViolations
          })
        }
      } else {
        setMonitoringStats((prev) => ({ ...prev, facesDetected: 1 }))
      }

      // Simulate eye gaze tracking
      if (Math.random() > 0.92) {
        setMonitoringStats((prev) => ({
          ...prev,
          eyeGazeWarnings: prev.eyeGazeWarnings + 1,
        }))

        if (Math.random() > 0.8) {
          setViolations((prev) => {
            const newViolations = prev + 1
            if (newViolations >= 3) {
              handleTerminateTest()
            }
            return newViolations
          })
        }
      }

      // Simulate phone detection
      if (Math.random() > 0.97) {
        setMonitoringStats((prev) => ({ ...prev, phoneDetected: true }))
        setViolations((prev) => {
          const newViolations = prev + 1
          if (newViolations >= 3) {
            handleTerminateTest()
          }
          return newViolations
        })
      } else {
        setMonitoringStats((prev) => ({ ...prev, phoneDetected: false }))
      }
    }, 3000)

    return () => clearInterval(monitoringInterval)
  }, [aiMonitoringActive])

  // Timer
  useEffect(() => {
    if (!testStarted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testStarted])

  // Monitor for tab switching and other violations
  useEffect(() => {
    if (!testStarted) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations((prev) => {
          const newViolations = prev + 1
          if (newViolations >= 3) {
            handleTerminateTest()
          }
          return newViolations
        })
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      setViolations((prev) => prev + 1)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [testStarted])

  const handleTerminateTest = () => {
    alert("Test terminated due to policy violation")
    router.push("/student/dashboard")
  }

  const handleSubmitTest = () => {
    alert("Test submitted successfully!")
    router.push("/student/dashboard")
  }

  const handleStartTest = () => {
    setShowConfirmStart(false)
    setTestStarted(true)
  }

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (showConfirmStart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800/80 border-slate-700 p-8 max-w-md w-full">
          <div className="flex gap-3 mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-500 text-sm">Important</p>
              <p className="text-yellow-400 text-xs mt-1">
                This exam is proctored with AI monitoring. Your webcam, eye movements, and actions will be monitored.
                Any violations will result in automatic termination.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Before Starting</h2>

          <ul className="space-y-3 mb-6 text-sm text-slate-300">
            <li className="flex gap-2">
              <span className="text-blue-500">✓</span>
              <span>Ensure your camera is working and well-lit</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">✓</span>
              <span>Position camera at eye level</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">✓</span>
              <span>Find a quiet location</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">✓</span>
              <span>Close all other applications</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">✓</span>
              <span>Keep your phone away and out of sight</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">✓</span>
              <span>Do not switch tabs during the exam</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">✓</span>
              <span>Maintain focus on the screen</span>
            </li>
          </ul>

          <Button onClick={handleStartTest} className="w-full bg-blue-600 hover:bg-blue-700 mb-3">
            I Understand, Start Exam
          </Button>

          <Button
            onClick={() => router.push("/student/dashboard")}
            variant="outline"
            className="w-full border-slate-600"
          >
            Cancel
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Top Status Bar */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-slate-400 mb-1">Time Remaining</div>
              <div className={`text-xl font-bold font-mono ${timeLeft < 600 ? "text-red-500" : "text-white"}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-600"></div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Violations</div>
              <div className={`text-xl font-bold ${violations > 0 ? "text-red-500" : "text-white"}`}>
                {violations}/3
              </div>
            </div>
            <div className="h-8 w-px bg-slate-600"></div>
            <div>
              <div className="text-xs text-slate-400 mb-1">AI Monitoring</div>
              <div
                className={`text-xs font-semibold flex items-center gap-1 ${aiMonitoringActive ? "text-green-500" : "text-slate-400"}`}
              >
                <div className={`w-2 h-2 rounded-full ${aiMonitoringActive ? "bg-green-500" : "bg-slate-500"}`}></div>
                {aiMonitoringActive ? "Active" : "Inactive"}
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Question {currentQuestionIdx + 1} of {questions.length}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-4 gap-6">
        {/* Main Exam Area */}
        <div className="lg:col-span-3">
          <Card className="bg-slate-800/50 border-slate-700 p-8 mb-6">
            <h3 className="text-lg font-semibold mb-6">{currentQuestion.text}</h3>

            {currentQuestion.type === "mcq" && currentQuestion.options && (
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors"
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleAnswer(option)}
                      className="w-4 h-4"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === "short" && (
              <textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full bg-slate-700/30 border border-slate-600 text-white rounded-lg p-4 placeholder-slate-500 mb-8"
                rows={5}
              />
            )}

            <div className="flex gap-3">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIdx === 0}
                variant="outline"
                className="border-slate-600 bg-transparent"
              >
                Previous
              </Button>

              {currentQuestionIdx === questions.length - 1 ? (
                <Button onClick={handleSubmitTest} className="ml-auto bg-green-600 hover:bg-green-700">
                  Submit Test
                </Button>
              ) : (
                <Button onClick={handleNext} className="ml-auto bg-blue-600 hover:bg-blue-700">
                  Next
                </Button>
              )}
            </div>
          </Card>

          {violations >= 2 && (
            <Card className="bg-red-500/10 border border-red-500/20 p-4 flex gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold text-red-500 text-sm">Warning</p>
                <p className="text-red-400 text-xs mt-1">
                  You have {3 - violations} violation{3 - violations !== 1 ? "s" : ""} remaining. The test will be
                  automatically terminated if you reach 3 violations.
                </p>
              </div>
            </Card>
          )}

          {/* AI Monitoring Alerts */}
          {(monitoringStats.facesDetected !== 1 ||
            monitoringStats.eyeGazeWarnings > 0 ||
            monitoringStats.phoneDetected) && (
            <Card className="bg-yellow-500/10 border border-yellow-500/20 p-4">
              <p className="font-semibold text-yellow-500 text-sm mb-2">AI Monitoring Alerts</p>
              <ul className="text-xs text-yellow-400 space-y-1">
                {monitoringStats.facesDetected !== 1 && (
                  <li>
                    {monitoringStats.facesDetected === 0
                      ? "⚠ Face not detected - ensure camera is pointing at you"
                      : `⚠ Multiple faces detected (${monitoringStats.facesDetected}) - you must be alone`}
                  </li>
                )}
                {monitoringStats.eyeGazeWarnings > 0 && (
                  <li>⚠ Suspicious eye movement detected - focus on the screen</li>
                )}
                {monitoringStats.phoneDetected && <li>⚠ Mobile device detected - remove it from your desk</li>}
              </ul>
            </Card>
          )}
        </div>

        {/* Sidebar: Camera & Monitoring */}
        <div className="space-y-6">
          {/* Camera Feed */}
          <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
            <div className="bg-black aspect-square flex items-center justify-center relative">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="absolute inset-0" style={{ display: "none" }} />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div
                  className={`w-2 h-2 rounded-full ${videoActive ? "bg-green-500" : "bg-red-500"} animate-pulse`}
                ></div>
                {videoActive ? "Camera Active" : "Camera Inactive"}
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="text-xs font-semibold text-slate-300 mb-4">AI Monitoring Stats</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Faces Detected</span>
                <span
                  className={`text-xs font-bold ${monitoringStats.facesDetected === 1 ? "text-green-500" : "text-red-500"}`}
                >
                  {monitoringStats.facesDetected}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Eye Tracking Warnings</span>
                <span
                  className={`text-xs font-bold ${monitoringStats.eyeGazeWarnings === 0 ? "text-green-500" : "text-yellow-500"}`}
                >
                  {monitoringStats.eyeGazeWarnings}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Phone Detected</span>
                <span
                  className={`text-xs font-bold ${!monitoringStats.phoneDetected ? "text-green-500" : "text-red-500"}`}
                >
                  {monitoringStats.phoneDetected ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </Card>

          {/* Question Navigator */}
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="text-xs font-semibold text-slate-300 mb-3">Questions</div>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`aspect-square rounded flex items-center justify-center text-xs font-semibold transition-colors ${
                    idx === currentQuestionIdx
                      ? "bg-blue-600 text-white"
                      : answers[q.id]
                        ? "bg-green-600/30 text-green-500"
                        : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
