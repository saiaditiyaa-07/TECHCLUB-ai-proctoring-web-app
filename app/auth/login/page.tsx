"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Camera, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "student"
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoActive, setVideoActive] = useState(false)

  useEffect(() => {
    if (role === "student") {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [role])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setVideoActive(true)
      }
    } catch (err) {
      console.error("Camera access denied:", err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setVideoActive(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (formData.email && formData.password) {
        if (role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/student/dashboard")
        }
      } else {
        setError("Please fill in all fields")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <Card className="bg-slate-800/80 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-2">{role === "admin" ? "Admin Login" : "Student Login"}</h2>
            <p className="text-slate-400 mb-6">
              {role === "admin" ? "Manage exams and analytics" : "Take secure proctored exams"}
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
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

              {error && (
                <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-slate-400 text-sm mb-4">Don't have an account?</p>
              <Link href={`/auth/register?role=${role}`}>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  Create Account
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex gap-2 text-sm text-slate-400">
              <Link href="/" className="hover:text-blue-400">
                ← Back to Home
              </Link>
            </div>
          </Card>

          {/* Right side - Camera preview (Students only) */}
          {role === "student" && (
            <Card className="bg-slate-800/80 border-slate-700 p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-white">Camera Preview</h3>
              </div>
              <div className="bg-black rounded-lg overflow-hidden mb-4 flex-1">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-slate-400 text-center">
                {videoActive
                  ? "Camera is active. Please ensure good lighting."
                  : "Camera permission required for exam proctoring"}
              </p>
            </Card>
          )}

          {role === "admin" && (
            <Card className="bg-slate-800/80 border-slate-700 p-8">
              <h3 className="text-lg font-semibold text-white mb-4">Admin Features</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Create and manage tests</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Upload questions (MCQ/PDF)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Assign tests to students</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>View real-time monitoring</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Analyze violation reports</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Export analytics to PDF</span>
                </li>
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
