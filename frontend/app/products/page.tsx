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
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produkte</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => load("latest")}>Neueste</Button>
          <Button variant="outline" onClick={() => load("rating")}>Beste Bewertung</Button>
          <Button onClick={() => load()}>Alle</Button>
        </div>
      </div>
      {loading && <div>Laden…</div>}
      {error && <div className="text-red-600">Fehler: {error}</div>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="text-lg">{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="group relative h-40 w-full overflow-hidden rounded">
                {!loadedMap[p.id] && <Skeleton className="absolute inset-0 h-full w-full" />}
                <Image
                  src={p.images?.[0]?.url || "/placeholder.svg"}
                  alt={p.images?.[0]?.alt || p.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onLoadingComplete={() => setLoadedMap((prev) => ({ ...prev, [p.id]: true }))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="text-sm">Version {p.version}</div>
              <div className="text-sm text-muted-foreground line-clamp-2">{p.shortDescription}</div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Preis {p.price?.uvp ?? p.price?.reseller} €</div>
                {p.id ? (
                  <Button asChild variant="outline"><Link href={`/products/${p.id}`}>Details…</Link></Button>
                ) : (
                  <Button variant="outline" disabled>Details…</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}