"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  inStockOnly: boolean
  setInStockOnly: (v: boolean) => void
  priceMax: number
  setPriceMax: (v: number) => void
  clearAllFilters: () => void
}

export function MobileFiltersPanel({ open, onOpenChange, inStockOnly, setInStockOnly, priceMax, setPriceMax, clearAllFilters }: Props) {
  if (!open) return null
  return (
    <div className="mt-3 lg:hidden border rounded-lg p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(Boolean(v))} id="stock" />
          <Label htmlFor="stock">Nur verfügbare anzeigen</Label>
        </div>
        <div className="space-y-2">
          <Label>Maximaler Preis</Label>
          <Slider value={[priceMax]} onValueChange={(vals) => setPriceMax(vals[0])} min={0} max={1000} step={10} />
          <div className="text-sm text-muted-foreground">{priceMax} €</div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={clearAllFilters}>Alle löschen</Button>
          <Button onClick={() => onOpenChange(false)}>Anwenden</Button>
        </div>
      </div>
    </div>
  )
}