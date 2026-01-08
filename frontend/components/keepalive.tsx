"use client"

import { useEffect } from "react"

export default function KeepAlive() {
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const ping = () => {
      fetch(`${base}/products`, { cache: "no-store" }).catch(() => {})
    }
    ping()
    const id = setInterval(ping, 14 * 60 * 1000)
    return () => clearInterval(id)
  }, [])
  return null
}