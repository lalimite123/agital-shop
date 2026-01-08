export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://agital-shop.onrender.com"
  try {
    const res = await fetch(`${base}/products`, { cache: "no-store" })
    const ok = res.ok
    const data = ok ? await res.json() : null
    return Response.json({ ok, timestamp: new Date().toISOString(), count: Array.isArray(data) ? data.length : null })
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message ?? "error", timestamp: new Date().toISOString() }, { status: 500 })
  }
}