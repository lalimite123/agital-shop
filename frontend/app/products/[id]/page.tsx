"use client"

import { useEffect, useState } from "react"
import { apiGet, apiPost } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

type Review = {
  id: string
  rating: number
  name: string
  text: string
  createdAt: string
}

type Product = {
  id: string
  name: string
  version: string
  shortDescription: string
  longDescription: string
  reviews: Review[]
  images?: { url: string; alt?: string }[]
  price?: { reseller?: number; uvp?: number; discount?: number }
  inStock?: boolean
  createdAt?: string
}

import { useParams } from "next/navigation"

export default function ProductDetailPage() {
  const routeParams = useParams() as { id?: string }
  const id = routeParams?.id
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [rating, setRating] = useState(5)
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [mainLoaded, setMainLoaded] = useState(false)

  async function load() {
    try {
      setLoading(true)
      if (!id) throw new Error("Fehlender Parameter")
      const data = await apiGet(`/products/${id}`)
      setProduct(data)
    } catch (e: any) {
      setError(e?.message ?? "Fehler")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    load()
  }, [id])

  async function submitReview() {
    try {
      setSubmitting(true)
      if (!id) throw new Error("Fehlender Parameter")
      await apiPost(`/reviews`, { rating, name, text, productId: id })
      setName("")
      setText("")
      await load()
    } catch (e) {
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-6">Laden…</div>
  if (error) return <div className="p-6 text-red-600">Fehler: {error}</div>
  if (!product) return <div className="p-6">Nicht gefunden</div>

  return (
    <main className="p-6 space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Galerie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="group relative h-64 w-full overflow-hidden rounded cursor-zoom-in" onClick={() => setLightboxOpen(true)}>
              {!mainLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
              <Image
                src={product.images?.[0]?.url || "/placeholder.svg"}
                alt={product.images?.[0]?.alt || product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onLoadingComplete={() => setMainLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images?.slice(1).map((img, i) => (
                <div key={i} className="relative h-20 w-32 overflow-hidden rounded">
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover transition-transform duration-300 hover:scale-105" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{product.inStock ? "Auf Lager" : "Nicht vorrätig"}</Badge>
              <span className="text-lg font-semibold">{product.price?.uvp ?? product.price?.reseller} €</span>
            </div>
            <div className="text-sm">Version {product.version}</div>
            <div className="text-sm text-muted-foreground">{product.shortDescription}</div>
            {product.createdAt ? <div className="text-xs text-muted-foreground">Erstellt am {new Date(product.createdAt).toLocaleDateString()}</div> : null}
            <div className="flex gap-2">
              <Button className="flex-1">Kaufen</Button>
              <Button variant="outline" className="flex-1">Zu Favoriten hinzufügen</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beschreibung</CardTitle>
        </CardHeader>
        <CardContent>
          <div>{product.longDescription}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bewertungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {product.reviews?.map((r) => (
              <Card key={r.id}>
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.name}</div>
                    <div>{"★".repeat(r.rating)}</div>
                  </div>
                  <div className="text-sm">{r.text}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Bewertung hinzufügen</h3>
        <div className="grid gap-3 max-w-md">
          <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} placeholder="Bewertung 1–5" />
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ihr Name" />
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Ihre Bewertung" />
          <Button disabled={submitting} onClick={submitReview}>Senden</Button>
        </div>
      </section>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="p-0 sm:max-w-4xl" showCloseButton>
          <div className="relative w-[90vw] max-w-4xl h-[70vh] bg-black">
            <Image
              src={product.images?.[0]?.url || "/placeholder.svg"}
              alt={product.images?.[0]?.alt || product.name}
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}