# agital.soft Shop Frontend

Frontend‑Anwendung mit Next.js (App Router) zur Anzeige von Produkten, Suche und Bewertungen, angebunden an das NestJS‑Backend.

## Funktionen

- Produktliste mit Sortierungen (neueste, beste Bewertung)
- Produktdetail mit Galerie, Infos und Bewertungen
- Bewertung abgeben (Sterne, Name, Text)
- Volltextsuche über Produkte

## Installation

```bash
cd frontend
npm install
```

## Konfiguration

- Das Frontend ruft die Backend‑API über die Variable `NEXT_PUBLIC_API_BASE_URL` auf.
- Standardwert: `http://localhost:4000`.
- Legen Sie bei Bedarf eine Datei `.env.local` im Ordner `frontend` an:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
```

## Starten

Stellen Sie sicher, dass das Backend unter `http://localhost:4000` läuft (siehe Backend‑README), dann:

```bash
npm run dev
```

- Dev : `http://localhost:3000`
- Build : `npm run build`
- Production locale : `npm start`
- Lint : `npm run lint`

## Fetch‑API‑Architektur

- HTTP‑Wrapper in `lib/api.ts`:

```ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

export async function apiGet(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function apiPost(path: string, body: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
```

- Pages clés et usage des wrappers :
  - `app/products/page.tsx` : `apiGet('/products')`, `apiGet('/products?sort=latest')`, `apiGet('/products?sort=rating')`
  - `app/products/[id]/page.tsx` : `apiGet('/products/:id')`, `apiPost('/reviews', {...})`
  - `app/search/page.tsx` : `apiGet('/search?q=motCle')`

### Exemples d’utilisation

```ts
// Liste des produits
const products = await apiGet('/products')

// Tri par derniers
const latest = await apiGet('/products?sort=latest')

// Détail produit
const product = await apiGet(`/products/${id}`)

// Recherche
const results = await apiGet(`/search?q=${encodeURIComponent(q)}`)

// Créer un avis
await apiPost('/reviews', { rating, name, text, productId: id })
```

## Verzeichnisstruktur

- `app/` : pages Next.js (App Router)
  - `app/products/page.tsx` : liste des produits
  - `app/products/[id]/page.tsx` : détail produit + avis
  - `app/search/page.tsx` : recherche
- `components/` : composants UI (Radix UI/Shadcn-like)
- `lib/api.ts` : wrappers HTTP `apiGet`/`apiPost`
- `styles/` et `app/globals.css` : styles globaux

## Hinweise

- Das Frontend erwartet ein Backend, das die im Backend‑README beschriebenen Endpunkte bereitstellt.
- Bei HTTP‑Fehlern werfen die Wrapper eine Exception (`HTTP <Code>`).

## Deployment auf Vercel

- Umgebungsvariablen:
  - `NEXT_PUBLIC_API_BASE_URL` = `https://agital-shop.onrender.com`
- Build und Start:
  - Build: `npm run build`
  - Produktion: `npm start`
- Prüfungen:
  - `GET https://agital-shop.onrender.com/products` liefert JSON
  - Die Landing lädt “Die 10 neuesten” und “Die 10 bestbewerteten”
- Hinweise:
  - CORS im Backend muss `https://agital-shop.vercel.app` enthalten
  - Verwenden Sie `frontend/.env.example` als Referenz

## Docker (optional)

- Image frontend: `frontend/Dockerfile`
- Build local:
  - `docker build -t agital-frontend:latest -f frontend/Dockerfile .`
- Compose local (avec backend/mongo):
  - `docker compose up -d`