import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({ message: "Not found" }, { status: 404 })
}
export function POST() {
  return NextResponse.json({ message: "Not found" }, { status: 404 })
}
