"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight, Eye, ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import Image from "next/image"

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

function ProductCard({ 
  product, 
  index, 
  viewMode,
  loadedMap,
  onImageLoaded 
}: { 
  product: Product
  index: number
  viewMode: "grid" | "list"
  loadedMap: Record<string, boolean>
  onImageLoaded: (id: string) => void
}) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isFavorite, setIsFavorite] = React.useState(false)

  function getBasePrice(p: Product) {
    if (typeof p.price === 'number') return p.price
    return p.price?.uvp ?? p.price?.reseller ?? undefined
  }

  function getDiscountedPrice(p: Product) {
    const base = getBasePrice(p)
    if (base === undefined) return null
    const discountPercent = typeof p.price !== 'number' ? p.price?.discount : p.blackFridayDiscount
    const active = p.blackFridayActive || (discountPercent !== undefined && discountPercent > 0)
    const percent = discountPercent ?? p.blackFridayDiscount ?? 0
    if (active && percent > 0) {
      return base * (1 - percent / 100)
    }
    return base
  }

  const priceToShow = getDiscountedPrice(product)

  return (
    <Card 
      className="group relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:bg-white animate-fadeIn"
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 relative">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl bg-neutral-50">
          {!loadedMap[product.id] && <Skeleton className="absolute inset-0" />}
          
          <img
            src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
            alt={product.images?.[0]?.alt || product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
            onLoad={() => onImageLoaded(product.id)}
          />
          
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />

          

          {/* Stock Status Badge - Glassmorphism */}
          <div className="absolute top-3 right-3 z-10">
            <div className={`px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg ${
              product.inStock 
                ? 'bg-emerald-50/90 border-emerald-200/40' 
                : 'bg-neutral-50/90 border-neutral-200/40'
            }`}>
              <span className={`text-xs font-medium ${product.inStock ? 'text-emerald-700' : 'text-neutral-600'}`}>
                {product.inStock ? 'Auf Lager' : 'Nicht vorrätig'}
              </span>
            </div>
          </div>

          {/* Action Buttons Overlay - Glassmorphism */}
          <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            
            <button className="w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-white shadow-lg">
              <Eye className="w-4 h-4 text-neutral-600 transition-colors duration-300" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative p-5 space-y-4 bg-white/50 backdrop-blur-sm">
          {/* Product Name */}
          <h3 className="text-sm font-medium text-neutral-800 line-clamp-2 leading-relaxed">
            {product.name}
          </h3>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-neutral-900">
                {priceToShow ? priceToShow.toFixed(2) : ""}€
              </span>
            </div>
          </div>

          {/* Action Button - Details */}
          <div className="flex items-center pt-2">
            <Link href={`/products/${product.id}`} className="flex-1">
              <Button className="w-full h-11 px-4 rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 transition-all duration-300 shadow-md flex items-center justify-center gap-2">
                <span className="text-sm font-semibold">Detail</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductsSection({ 
  title,
  linkHref,
  items,
  loading,
  error,
  viewMode,
  loadedMap: initialLoadedMap,
  onImageLoaded: externalOnImageLoaded
}: Props) {
  const [loadedMap, setLoadedMap] = React.useState<Record<string, boolean>>(initialLoadedMap)

  const handleImageLoaded = (id: string) => {
    setLoadedMap(prev => ({ ...prev, [id]: true }))
    externalOnImageLoaded?.(id)
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      {/* Minimal Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-neutral-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neutral-100/40 rounded-full blur-3xl" />
      </div>

      {/* Banner Header */}
      <Link href={linkHref} className="block group mb-8">
        <div className="relative h-40 sm:h-48 md:h-64 overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-slate-800 to-slate-900">
          <Image
            src={title.toLowerCase().includes('neu') ? '/banner_1.jpg' : '/banner_2.jpg'}
            alt={title}
            fill
            quality={100}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 p-4 sm:p-6 md:p-8 flex items-center justify-between gap-4">
            <div className="text-white max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-medium mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Empfehlungen</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{title}</h3>
              <p className="text-white/80 text-xs sm:text-sm">{items?.length ?? 0} Produkte</p>
            </div>
            <div className="hidden sm:flex">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-400 text-slate-900 font-bold group-hover:bg-amber-500 transition">
                Alle anzeigen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </Link>

      {loading && (
        <div className="text-neutral-600 text-center py-12">
          <div className="inline-block w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
        </div>
      )}
      
      {error && (
        <div className="text-neutral-700 text-center py-8 bg-neutral-50 rounded-2xl border border-neutral-200">
          <p className="text-sm font-medium">Fehler: {error}</p>
        </div>
      )}

      {/* Products Display */}
      {viewMode === 'list' ? (
        <Carousel className="w-full" opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-4">
            {items.map((product, idx) => (
              <CarouselItem key={product.id} className="pl-4 basis-[50%] sm:basis-[60%] md:basis-[45%] lg:basis-[380px]">
                <ProductCard 
                  product={product} 
                  index={idx}
                  viewMode={viewMode}
                  loadedMap={loadedMap}
                  onImageLoaded={handleImageLoaded}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Glassmorphism Navigation Buttons */}
          <CarouselPrevious className="hidden sm:flex -left-12 w-11 h-11 border border-neutral-200/60 bg-white/90 backdrop-blur-md hover:bg-white shadow-lg" />
          <CarouselNext className="hidden sm:flex -right-12 w-11 h-11 border border-neutral-200/60 bg-white/90 backdrop-blur-md hover:bg-white shadow-lg" />
        </Carousel>
      ) : (
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product, idx) => (
            <ProductCard 
              key={product.id}
              product={product} 
              index={idx}
              viewMode={viewMode}
              loadedMap={loadedMap}
              onImageLoaded={handleImageLoaded}
            />
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { 
          animation: fadeIn 0.5s ease-out forwards; 
          opacity: 0;
        }
      `}</style>
    </section>
  )
}