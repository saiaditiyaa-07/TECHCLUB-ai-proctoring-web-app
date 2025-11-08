"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "student"
  const [step, setStep] = useState(1) // 1: Details, 2: Face Capture
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [videoActive, setVideoActive] = useState(false)
  const [faceCaptured, setFaceCaptured] = useState(false)
  const [faceImage, setFaceImage] = useState<string | null>(null)

  useEffect(() => {
    if (step === 2 && role === "student") {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [step, role])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setVideoActive(true)
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions.")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setVideoActive(false)
    }
  }

  const captureFace = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        ctx.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL("image/jpeg")
        setFaceImage(imageData)
        setFaceCaptured(true)
        setSuccess("Face captured successfully!")
        setTimeout(() => setSuccess(""), 3000)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (role === "student") {
      setStep(2)
    } else {
      handleRegister()
    }
  }

  const handleRegister = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess("Account created successfully!")
      setTimeout(() => {
        router.push(`/auth/login?role=${role}`)
      }, 1500)
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteRegistration = async () => {
    if (!faceCaptured) {
      setError("Please capture your face to continue")
      return
    }
    handleRegister()
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800/80 border-slate-700 p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-2">Face Verification</h2>
          <p className="text-slate-400 mb-6">Capture your face for identity verification during exams</p>

          <div className="bg-black rounded-lg overflow-hidden mb-6 aspect-video">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {faceImage && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-green-500 font-semibold text-sm">Face Captured</p>
                <p className="text-green-400 text-xs">Your face has been saved</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 flex gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              <CheckCircle className="w-4 h-4 mt-0.5" />
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 flex gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              {error}
            </div>
          )}

          <div className="flex gap-3 mb-4">
            <Button onClick={captureFace} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Capture Photo
            </Button>
            <Button onClick={() => setFaceImage(null)} variant="outline" className="flex-1 border-slate-600">
              Retake
            </Button>
          </div>

          <Button
            onClick={handleCompleteRegistration}
            disabled={!faceCaptured || isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? "Creating Account..." : "Complete Registration"}
          </Button>

          <Button variant="outline" onClick={() => setStep(1)} className="w-full mt-3 border-slate-600">
            Back
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="bg-slate-800/80 border-slate-700 p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-slate-400 mb-6">{role === "admin" ? "Register as administrator" : "Register as student"}</p>

        <form onSubmit={handleStep1Submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
              required
            />
          </div>

          {error && (
            <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              {error}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
            {role === "student" ? "Next: Face Verification" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-slate-400 text-sm mb-4">Already have an account?</p>
          <Link href={`/auth/login?role=${role}`}>
            <Button variant="outline" className="w-full border-slate-600 bg-transparent">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-4 flex gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-blue-400">
            ← Back to Home
          </Link>
        </div>
      </Card>
    </div>
  )
}
