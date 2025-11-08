"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Activity, AlertTriangle, Wifi, Radio, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface RFMonitoringData {
  testId: string
  activeTests: number
  devicesDetected: number
  anomalies: number
  threatLevel: "low" | "medium" | "high"
}

export default function RFMonitoringPage() {
  const router = useRouter()
  const [monitoringData] = useState<RFMonitoringData>({
    testId: "active",
    activeTests: 15,
    devicesDetected: 127,
    anomalies: 2,
    threatLevel: "low",
  })

  const [rfScanHistory] = useState([
    { timestamp: "2024-11-20 10:15", devicesCount: 8, threat: "low", status: "normal" },
    { timestamp: "2024-11-20 10:30", devicesCount: 9, threat: "medium", status: "anomaly" },
    { timestamp: "2024-11-20 10:45", devicesCount: 7, threat: "low", status: "normal" },
    { timestamp: "2024-11-20 11:00", devicesCount: 10, threat: "low", status: "normal" },
    { timestamp: "2024-11-20 11:15", devicesCount: 6, threat: "low", status: "normal" },
  ])

  const handleLogout = () => {
    router.push("/")
  }

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case "high":
        return "text-red-500 bg-red-500/10"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10"
      default:
        return "text-green-500 bg-green-500/10"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">RF Hardware Monitoring</h1>
            <p className="text-slate-400 text-sm">Real-time electromagnetic spectrum analysis</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-slate-600 flex gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Status Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-2">Active Tests</div>
                <div className="text-3xl font-bold">{monitoringData.activeTests}</div>
              </div>
              <Activity className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-2">RF Devices Detected</div>
                <div className="text-3xl font-bold">{monitoringData.devicesDetected}</div>
              </div>
              <Wifi className="w-8 h-8 text-cyan-500 opacity-20" />
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-2">Anomalies Detected</div>
                <div className="text-3xl font-bold text-yellow-500">{monitoringData.anomalies}</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500 opacity-20" />
            </div>
          </Card>

          <Card
            className={`border-slate-700 p-6 ${monitoringData.threatLevel === "high" ? "bg-red-500/10" : monitoringData.threatLevel === "medium" ? "bg-yellow-500/10" : "bg-green-500/10"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400 mb-2">Overall Threat Level</div>
                <div className={`text-3xl font-bold ${getThreatColor(monitoringData.threatLevel)}`}>
                  {monitoringData.threatLevel.toUpperCase()}
                </div>
              </div>
              <Radio className={`w-8 h-8 opacity-20 ${getThreatColor(monitoringData.threatLevel)}`} />
            </div>
          </Card>
        </div>

        {/* RF Scan History */}
        <Card className="bg-slate-800/50 border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">RF Scan History (Last Hour)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700 bg-slate-900/50">
                <tr>
                  <th className="text-left p-3">Timestamp</th>
                  <th className="text-center p-3">Devices Detected</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-center p-3">Threat Level</th>
                  <th className="text-center p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {rfScanHistory.map((scan, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="p-3">{scan.timestamp}</td>
                    <td className="p-3 text-center">{scan.devicesCount}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 rounded text-xs bg-slate-700/50">
                        {scan.status === "anomaly" ? "⚠ " : "✓ "}
                        {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                      </span>
                    </td>
                    <td className={`p-3 text-center text-xs font-semibold ${getThreatColor(scan.threat)}`}>
                      {scan.threat.toUpperCase()}
                    </td>
                    <td className="p-3 text-center">
                      <Button variant="outline" size="sm" className="border-slate-600 text-xs h-7 bg-transparent">
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detected Devices Info */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-xl font-bold mb-4">Typical Detected Devices</h2>
          <p className="text-slate-400 text-sm mb-4">
            Normal devices detected during exam sessions. RF monitoring filters authorized devices.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <div className="font-semibold text-blue-400 mb-2">WiFi Networks</div>
              <p className="text-xs text-slate-400">
                All WiFi access points within range. Authorized networks are filtered.
              </p>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <div className="font-semibold text-cyan-400 mb-2">Bluetooth Devices</div>
              <p className="text-xs text-slate-400">
                Personal devices, speakers, and peripherals. Not a threat to exam integrity.
              </p>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <div className="font-semibold text-purple-400 mb-2">Cellular Signals</div>
              <p className="text-xs text-slate-400">
                Background cellular signals. Monitored for unusual patterns indicating hidden devices.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
