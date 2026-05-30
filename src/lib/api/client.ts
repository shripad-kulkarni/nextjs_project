import axios from "axios"
import https from "https"

// In development, the .NET API uses a self-signed dev cert that Node.js rejects.
// This agent skips certificate verification for server-side calls only.
const devHttpsAgent =
  process.env.NODE_ENV !== "production"
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
  httpsAgent: devHttpsAgent,
})

export default apiClient
