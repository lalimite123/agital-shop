"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Grid3X3, List, SlidersHorizontal, RefreshCw } from "lucide-react"

type Props = {
  searchQuery: string
  setSearchQuery: (v: string) => void
  onOpenSearch: () => void
  filtersOpen: boolean
  setFiltersOpen: (v: boolean) => void
  viewMode: "grid" | "list"
  setViewMode: (v: "grid" | "list") => void
  sortBy: "default" | "newest" | "popular" | "price-asc" | "price-desc" | "name-asc"
  setSortBy: (v: Props["sortBy"]) => void
  isRefreshing: boolean
  onRefresh: () => void
  activeFiltersCount: number
}

export function ControlsBar({
  searchQuery,
  setSearchQuery,
  onOpenSearch,
  filtersOpen,
  setFiltersOpen,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  isRefreshing,
  onRefresh,
  activeFiltersCount,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full">
      <div className="flex w-full items-center gap-3">
        <Input
          placeholder="Software suchen…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onOpenSearch()
          }}
          className="flex-1 min-w-0"
        />
        <Button onClick={onOpenSearch} className="flex-shrink-0">Suchen</Button>
      </div>
      <div className="flex w-full items-center gap-3">
        <Button variant="outline" onClick={() => setFiltersOpen(!filtersOpen)} className="lg:hidden relative flex-shrink-0">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filter
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-rose-500 text-white text-xs px-1.5 py-0.5">{activeFiltersCount}</Badge>
          )}
        </Button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex bg-slate-100 rounded-lg p-1 flex-shrink-0">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-rose-600" : "text-slate-600 hover:text-slate-800"}`}>
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-rose-600" : "text-slate-600 hover:text-slate-800"}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as Props["sortBy"]) }>
            <SelectTrigger className="w-full sm:w-48 border-slate-200 focus:border-rose-500 focus:ring-rose-500 min-w-0">
              <SelectValue placeholder="Sortieren nach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Relevanz</SelectItem>
              <SelectItem value="newest">Neueste</SelectItem>
              <SelectItem value="popular">Beliebteste</SelectItem>
              <SelectItem value="price-asc">Preis aufsteigend</SelectItem>
              <SelectItem value="price-desc">Preis absteigend</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={onRefresh} disabled={isRefreshing} className="flex items-center gap-2 flex-shrink-0">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Aktualisieren</span>
          </Button>
        </div>
      </div>
    </div>
  )
}