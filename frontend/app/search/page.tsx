"use client"

import { useState } from "react"
import { apiGet } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

type Product = {
  id: string
  name: string
  version: string
  shortDescription?: string
}

export default function SearchPage() {
  const [q, setQ] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function search() {
    try {
      setLoading(true)
      setError(null)
      const data = await apiGet(`/search?q=${encodeURIComponent(q)}`)
      setProducts(data)
    } catch (e: any) {
      setError(e?.message ?? "Erreur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Recherche</h1>
      <div className="flex gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Mot-clé" />
        <Button onClick={search}>Rechercher</Button>
      </div>
      {loading && <div>Chargement…</div>}
      {error && <div className="text-red-600">Erreur: {error}</div>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">Version {p.version}</div>
              <div className="text-sm text-muted-foreground line-clamp-2">{p.shortDescription}</div>
              <Link className="text-primary" href={`/products/${p.id}`}>Voir le détail</Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}