"use client"

import { useEffect, useState } from "react"
import { apiGet } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

type Product = {
  id: string
  name: string
  version: string
  shortDescription?: string
  images?: { url: string; alt?: string }[]
  price?: { reseller?: number; uvp?: number; discount?: number }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({})

  async function load(sort?: string) {
    try {
      setLoading(true)
      setError(null)
      const path = sort ? `/products?sort=${sort}` : "/products"
      const data = await apiGet(path)
      setProducts(data)
    } catch (e: any) {
      setError(e?.message ?? "Erreur")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-6 w-72 h-72 bg-neutral-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-6 w-72 h-72 bg-neutral-100/40 rounded-full blur-3xl" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">Produkte</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => load("latest")}>Neueste</Button>
          <Button variant="outline" onClick={() => load("rating")}>Beste Bewertung</Button>
          <Button onClick={() => load()}>Alle</Button>
        </div>
      </div>

      {loading && <div className="text-neutral-600">Laden…</div>}
      {error && <div className="text-red-600">Fehler: {error}</div>}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <Card key={p.id} className="overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-neutral-900">{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                {!loadedMap[p.id] && <Skeleton className="absolute inset-0" />}
                <Image
                  src={p.images?.[0]?.url || "/placeholder.svg"}
                  alt={p.images?.[0]?.alt || p.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  onLoadingComplete={() => setLoadedMap((prev) => ({ ...prev, [p.id]: true }))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="text-sm">Version {p.version}</div>
              <div className="text-sm text-neutral-600 line-clamp-2">{p.shortDescription}</div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-neutral-900">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format((p.price?.uvp ?? p.price?.reseller) || 0)}
                </div>
                {p.id ? (
                  <Button asChild variant="outline"><Link href={`/products/${p.id}`}>Detail</Link></Button>
                ) : (
                  <Button variant="outline" disabled>Detail</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}