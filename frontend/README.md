# agital.soft Shop Frontend

Application frontend construite avec Next.js (App Router) pour l’affichage des produits, la recherche et la gestion des avis, connectée au backend NestJS.

## Fonctionnalités

- Liste des produits avec tris (dernier, meilleure note)
- Détail d’un produit avec galerie, infos et avis
- Soumission d’un avis (note, nom, texte)
- Recherche plein texte sur les produits

## Installation

```bash
cd frontend
npm install
```

## Configuration

- Le frontend consomme les API du backend via la variable `NEXT_PUBLIC_API_BASE_URL`.
- Par défaut, l’URL est `http://localhost:4000`.
- Créez un fichier `.env.local` à la racine de `frontend` si besoin :

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
```

## Démarrer

Assurez-vous que le backend est démarré sur `http://localhost:4000` (voir README du backend), puis :

```bash
npm run dev
```

- Dev : `http://localhost:3000`
- Build : `npm run build`
- Production locale : `npm start`
- Lint : `npm run lint`

## Architecture de Fetch API

- Wrapper HTTP dans `lib/api.ts` :

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

## Structure des répertoires

- `app/` : pages Next.js (App Router)
  - `app/products/page.tsx` : liste des produits
  - `app/products/[id]/page.tsx` : détail produit + avis
  - `app/search/page.tsx` : recherche
- `components/` : composants UI (Radix UI/Shadcn-like)
- `lib/api.ts` : wrappers HTTP `apiGet`/`apiPost`
- `styles/` et `app/globals.css` : styles globaux

## Notes

- Le frontend attend l’API du backend compatible avec les endpoints décrits dans le README backend.
- En cas d’erreur HTTP, les wrappers lèvent une exception (`HTTP <code>`).

## Déploiement sur Vercel

- Variables d’environnement:
  - `NEXT_PUBLIC_API_BASE_URL` = `https://agital-shop.onrender.com`
- Build et start:
  - Build: `npm run build`
  - Production: `npm start`
- Vérifications:
  - `GET https://agital-shop.onrender.com/products` retourne JSON
  - La landing charge “Die 10 neuesten” et “Die 10 bestbewerteten”
- Astuces:
  - CORS côté backend doit inclure `https://agital-shop.vercel.app`
  - Utiliser `frontend/.env.example` comme référence

## Docker (optionnel)

- Image frontend: `frontend/Dockerfile`
- Build local:
  - `docker build -t agital-frontend:latest -f frontend/Dockerfile .`
- Compose local (avec backend/mongo):
  - `docker compose up -d`