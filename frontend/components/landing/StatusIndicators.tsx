"use client"

import { Button } from "@/components/ui/button"
import { Clock, Filter as FilterIcon } from "lucide-react"

type Props = {
  lastRefreshLabel: string
  activeFiltersCount: number
  onClearFilters: () => void
}

export function StatusIndicators({ lastRefreshLabel, activeFiltersCount, onClearFilters }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4 pt-4 border-t border-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{lastRefreshLabel}</span>
        </div>
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{activeFiltersCount} Filter aktiv</span>
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-rose-600 hover:text-rose-700 h-auto p-1 flex-shrink-0">Alle löschen</Button>
          </div>
        )}
      </div>
    </div>
  )
}