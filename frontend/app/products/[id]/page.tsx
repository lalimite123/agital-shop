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
    <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-16 left-8 w-72 h-72 bg-neutral-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-8 w-80 h-80 bg-neutral-100/40 rounded-full blur-3xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Galerie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="group relative h-72 sm:h-80 w-full overflow-hidden rounded-2xl cursor-zoom-in" onClick={() => setLightboxOpen(true)}>
              {!mainLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
              <Image
                src={product.images?.[0]?.url || "/placeholder.svg"}
                alt={product.images?.[0]?.alt || product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                onLoadingComplete={() => setMainLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images?.slice(1).map((img, i) => (
                <div key={i} className="relative h-20 w-32 overflow-hidden rounded-xl border border-neutral-200">
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover transition-transform duration-300 hover:scale-105" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/80 backdrop-blur-sm lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-neutral-900">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className={product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-neutral-50 text-neutral-700"}>{product.inStock ? "Auf Lager" : "Nicht vorrätig"}</Badge>
              <span className="text-2xl font-bold text-neutral-900">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format((product.price?.uvp ?? product.price?.reseller) || 0)}
              </span>
            </div>
            <div className="text-sm">Version {product.version}</div>
            <div className="text-sm text-neutral-600">{product.shortDescription}</div>
            {product.createdAt ? <div className="text-xs text-neutral-500">Erstellt am {new Date(product.createdAt).toLocaleDateString('de-DE')}</div> : null}
            <div className="flex gap-2">
              <Button className="flex-1 bg-neutral-900 text-white hover:bg-neutral-800">Kaufen</Button>
              <Button variant="outline" className="flex-1">Zu Favoriten hinzufügen</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border border-neutral-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Beschreibung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-neutral-800 leading-relaxed">{product.longDescription}</div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-neutral-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Bewertungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {product.reviews?.map((r) => (
              <Card key={r.id} className="border border-neutral-200">
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  </div>
                  <div className="text-sm text-neutral-700">{r.text}</div>
                  {r.createdAt ? <div className="text-xs text-neutral-400 mt-1">{new Date(r.createdAt).toLocaleDateString('de-DE')}</div> : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Bewertung hinzufügen</h3>
        <div className="grid gap-3 max-w-md">
          <div className="flex gap-2">
            {[1,2,3,4,5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl ${star <= rating ? 'text-amber-400' : 'text-neutral-300'}`}>★</button>
            ))}
          </div>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ihr Name" />
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Ihre Bewertung" />
          <Button disabled={submitting || !name || !text} onClick={submitReview}>Senden</Button>
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