"use client"

import { useEffect, useState } from "react"
import { apiGet } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { SearchModal } from "@/components/search-modal"
import Image from "next/image"
import { Hero } from "@/components/landing/Hero"
import { ControlsBar } from "@/components/landing/ControlsBar"
import { MobileFiltersPanel } from "@/components/landing/MobileFiltersPanel"
import { StatusIndicators } from "@/components/landing/StatusIndicators"
import { ProductsSection } from "@/components/landing/ProductsSection"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Grid3X3, List, SlidersHorizontal, RefreshCw, Clock, Filter as FilterIcon } from "lucide-react"

type Product = {
  id: string
  name: string
  version: string
  shortDescription?: string
  price?: { reseller?: number; uvp?: number; discount?: number }
  images?: { url: string; alt?: string }[]
  inStock?: boolean
  reviews?: { rating: number }[]
}

export default function HomePage() {
  const [latest, setLatest] = useState<Product[]>([])
  const [rated, setRated] = useState<Product[]>([])
  const [loadingLatest, setLoadingLatest] = useState(true)
  const [loadingRated, setLoadingRated] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [priceMax, setPriceMax] = useState<number>(1000)
  const [loadedLatest, setLoadedLatest] = useState<Record<string, boolean>>({})
  const [loadedRated, setLoadedRated] = useState<Record<string, boolean>>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'default' | 'newest' | 'popular' | 'price-asc' | 'price-desc' | 'name-asc'>('default')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<number | null>(null)

  function average(reviews?: { rating: number }[], fallback?: number) {
    if (fallback !== undefined) return Math.round(fallback * 10) / 10
    if (!reviews || reviews.length === 0) return 0
    const s = reviews.reduce((a, r) => a + r.rating, 0)
    return Math.round((s / reviews.length) * 10) / 10
  }

  /**
   * Lädt Produktdaten vom Backend.
   * - Neueste 10: GET `/products?sort=latest`
   * - Bestbewertete 10: GET `/products?sort=rating`
   * Setzt Ladezustände (`loadingLatest`, `loadingRated`) und Fehler (`error`).
   */
  useEffect(() => {
    Promise.all([
      (async () => {
        try {
          const data = await apiGet("/products?sort=latest")
          setLatest(data)
        } catch (e: any) {
          setError(e?.message ?? "Erreur inconnue")
        } finally {
          setLoadingLatest(false)
        }
      })(),
      (async () => {
        try {
          const data = await apiGet("/products?sort=rating")
          setRated(data)
        } catch (e: any) {
          setError(e?.message ?? "Erreur inconnue")
        } finally {
          setLoadingRated(false)
        }
      })(),
    ])
  }, [])

  function priceValue(p: Product) {
    return p.price?.uvp ?? p.price?.reseller ?? 0
  }

  useEffect(() => {
    if (!loadingLatest && !loadingRated) setLastRefresh(Date.now())
  }, [loadingLatest, loadingRated])

  function sortProducts(list: Product[]) {
    if (sortBy === 'price-asc') return [...list].sort((a, b) => priceValue(a) - priceValue(b))
    if (sortBy === 'price-desc') return [...list].sort((a, b) => priceValue(b) - priceValue(a))
    if (sortBy === 'name-asc') return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    return list
  }

  const latestFiltered = latest.filter((p) => (!inStockOnly || p.inStock) && priceValue(p) <= priceMax)
  const ratedFiltered = rated.filter((p) => (!inStockOnly || p.inStock) && priceValue(p) <= priceMax)
  const latestDisplay = sortProducts(latestFiltered)
  const ratedDisplay = sortProducts(ratedFiltered)

  const activeFiltersCount = (inStockOnly ? 1 : 0) + (priceMax < 1000 ? 1 : 0)
  function clearAllFilters() {
    setInStockOnly(false)
    setPriceMax(1000)
  }
  function formatLastRefresh() {
    return lastRefresh ? new Date(lastRefresh).toLocaleString() : '—'
  }
  /**
   * Aktualisiert die Produktlisten manuell durch erneute API‑Abrufe
   * und setzt den Zeitstempel der letzten Aktualisierung.
   * Zeigt währenddessen den Ladeindikator (`isRefreshing`) und behandelt Fehler.
   */
  async function handleManualRefresh() {
    try {
      setIsRefreshing(true)
      setError(null)
      const [latestRes, ratedRes] = await Promise.all([
        apiGet("/products?sort=latest"),
        apiGet("/products?sort=rating"),
      ])
      setLatest(latestRes)
      setRated(ratedRes)
      setLastRefresh(Date.now())
    } catch (e: any) {
      setError(e?.message ?? "Erreur inconnue")
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <main className="space-y-10">
      <Hero />
      <section className="mx-auto max-w-6xl px-6">
        <ControlsBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSearch={() => setIsSearchOpen(true)}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy as any}
          isRefreshing={isRefreshing}
          onRefresh={handleManualRefresh}
          activeFiltersCount={activeFiltersCount}
        />
        <MobileFiltersPanel
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          inStockOnly={inStockOnly}
          setInStockOnly={(v) => setInStockOnly(Boolean(v))}
          priceMax={priceMax}
          setPriceMax={(v) => setPriceMax(v)}
          clearAllFilters={clearAllFilters}
        />
        <StatusIndicators lastRefreshLabel={formatLastRefresh()} activeFiltersCount={activeFiltersCount} onClearFilters={clearAllFilters} />
      </section>

      <ProductsSection
        title="Die 10 neuesten"
        linkHref="/products"
        items={latestDisplay}
        loading={loadingLatest}
        error={error}
        viewMode={viewMode}
        loadedMap={loadedLatest}
        onImageLoaded={(id) => setLoadedLatest((prev) => ({ ...prev, [id]: true }))}
      />

      <ProductsSection
        title="Die 10 bestbewerteten"
        linkHref="/products"
        items={ratedDisplay as any}
        loading={loadingRated}
        error={error}
        viewMode={viewMode}
        loadedMap={loadedRated}
        onImageLoaded={(id) => setLoadedRated((prev) => ({ ...prev, [id]: true }))}
      />

      {isSearchOpen && (
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} initialQuery={searchQuery} />
      )}
    </main>
  )
}