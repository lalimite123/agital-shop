"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Search, X, Package, Clock, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { apiGet } from "@/lib/api"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  initialQuery?: string
}

interface SearchResult {
  id: string
  name: string
  version?: string
  shortDescription?: string
  image?: string
  price?: number
}

export function SearchModal({ isOpen, onClose, initialQuery }: SearchModalProps) {
  const [query, setQuery] = useState(initialQuery ?? "")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem("agital-recent-searches")
    if (saved) setRecentSearches(JSON.parse(saved))
  }, [])

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    try {
      const data = await apiGet(`/search?q=${encodeURIComponent(searchQuery)}`)
      const mapped: SearchResult[] = data.slice(0, 8).map((p: any) => ({
        id: p.id,
        name: p.name,
        version: p.version,
        shortDescription: p.shortDescription,
        image: p.images?.[0]?.url,
        price: p.price?.uvp ?? p.price?.reseller,
      }))
      setSearchResults(mapped)
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [query, performSearch])

  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return
    const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("agital-recent-searches", JSON.stringify(updated))
  }

  const handleProductSelect = (product: SearchResult) => {
    saveRecentSearch(query)
    onClose()
    router.push(`/products/${product.id}`)
  }

  const handleRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      saveRecentSearch(query)
      onClose()
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-lg font-semibold text-gray-800">Produkte suchen</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Suchen..."
              className="pl-12 pr-4 py-4 text-lg bg-white/50 border-white/30 rounded-xl focus:bg-white/70 focus:border-blue-300 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {query.trim() && (
            <div className="px-6 pb-4">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                  <span className="ml-2 text-gray-600">Suche…</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Ergebnisse</h3>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/40 cursor-pointer transition-all group"
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{product.version}</Badge>
                          {product.price !== undefined && (
                            <span className="text-sm font-semibold text-blue-600">{product.price.toFixed(2)} €</span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Keine Produkte für "{query}"</p>
                </div>
              )}
            </div>
          )}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="px-6 pb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Letzte Suchen
              </h3>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/40 text-left transition-all group"
                    onClick={() => handleRecentSearch(search)}
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700 group-hover:text-gray-900">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-white/20 bg-white/10">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Enter zum Suchen</span>
            <span>Escape zum Schließen</span>
          </div>
        </div>
      </div>
    </div>
  )
}