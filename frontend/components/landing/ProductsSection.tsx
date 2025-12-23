"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Product = {
  id: string
  name: string
  images?: { url: string; alt?: string }[]
  price?: { reseller?: number; uvp?: number; discount?: number } | number
  blackFridayActive?: boolean
  blackFridayDiscount?: number
  inStock?: boolean
}

type Props = {
  title: string
  linkHref: string
  items: Product[]
  loading: boolean
  error: string | null
  viewMode: "grid" | "list"
  loadedMap: Record<string, boolean>
  onImageLoaded: (id: string) => void
}

export function ProductsSection({ title, linkHref, items, loading, error, viewMode, loadedMap, onImageLoaded }: Props) {

  function getBasePrice(p: Product) {
    if (typeof p.price === 'number') return p.price
    return p.price?.uvp ?? p.price?.reseller ?? undefined
  }

  function renderPrice(p: Product) {
    const base = getBasePrice(p)
    if (base === undefined) return null
    const discountPercent = typeof p.price !== 'number' ? p.price?.discount : p.blackFridayDiscount
    const active = p.blackFridayActive || (discountPercent !== undefined && discountPercent > 0)
    const percent = discountPercent ?? p.blackFridayDiscount ?? 0
    if (active && percent > 0) {
      const discounted = base * (1 - percent / 100)
      return <span className="text-lg font-semibold text-slate-900">{discounted.toFixed(2)}€</span>
    }
    return <span className="text-lg font-semibold text-slate-900">{base.toFixed(2)}€</span>
  }

  return (
    <section className="mx-auto max-w-6xl px-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link className="text-primary" href={linkHref}>Alle anzeigen</Link>
      </div>
      {loading && <div>Laden…</div>}
      {error && <div className="text-red-600">Fehler: {error}</div>}
      <div className={viewMode === 'grid' ? '' : 'overflow-x-auto'}>
        <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'flex gap-4 pb-2'}>
          {items.map((p) => (
            <Card key={p.id} className="min-w-[280px]">
              <CardContent className="p-3 space-y-3">
                <div className="group relative h-32 w-full overflow-hidden rounded">
                  {p.id ? (
                    <Link href={`/products/${p.id}`} className="block h-full w-full">
                      {!loadedMap[p.id] && <Skeleton className="absolute inset-0 h-full w-full" />}
                      <Image
                        src={p.images?.[0]?.url || "/placeholder.svg"}
                        alt={p.images?.[0]?.alt || p.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onLoadingComplete={() => onImageLoaded(p.id)}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  ) : (
                    <Image src={p.images?.[0]?.url || "/placeholder.svg"} alt={p.name} fill className="object-cover" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="font-medium">{p.name}</div>
                  <Badge variant="secondary" className={p.inStock ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}>
                    {p.inStock ? "Auf Lager" : "Nicht vorrätig"}
                  </Badge>
                </div>
                <div className="py-2 border-y border-slate-200">
                  {renderPrice(p)}
                </div>
                <div className="flex justify-end">
                  {p.id ? (
                    <Button asChild variant="outline">
                      <Link href={`/products/${p.id}`}>Mehr entdecken</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>Mehr entdecken</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}