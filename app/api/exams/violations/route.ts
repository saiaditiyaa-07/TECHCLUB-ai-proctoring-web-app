import { type NextRequest, NextResponse } from "next/server"

interface ViolationRecord {
  testId: string
  studentId: string
  type: string
  severity: "high" | "medium" | "low"
  timestamp: string
  details: string
  frameData?: string
}

// In-memory store for violations (in production, use a database)
const violations: ViolationRecord[] = []

export async function POST(request: NextRequest) {
  try {
    const violation = await request.json()

    // Validate violation data
    if (!violation.testId || !violation.studentId || !violation.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const record: ViolationRecord = {
      ...violation,
      timestamp: new Date().toISOString(),
    }

    violations.push(record)

    // In production, save to database and trigger notifications
    console.log("Violation recorded:", record)

    return NextResponse.json({
      success: true,
      violationId: violations.length - 1,
      recorded: record,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to record violation" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testId = searchParams.get("testId")
    const studentId = searchParams.get("studentId")

    let filtered = violations

    if (testId) {
      filtered = filtered.filter((v) => v.testId === testId)
    }

    if (studentId) {
      filtered = filtered.filter((v) => v.studentId === studentId)
    }

    // Group by type and severity
    const summary = {
      total: filtered.length,
      byType: {} as Record<string, number>,
      bySeverity: {
        high: 0,
        medium: 0,
        low: 0,
      },
      violations: filtered,
    }

    filtered.forEach((v) => {
      summary.byType[v.type] = (summary.byType[v.type] || 0) + 1
      summary.bySeverity[v.severity]++
    })

    return NextResponse.json(summary)
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve violations" }, { status: 500 })
  }
}
