# agital.soft Shop-Backend

NestJS-Backend mit Prisma und MongoDB für die Anwendung des digitalen Shops.

## Funktionen

- Produktmodul: Alle Produkte abrufen, die neuesten 10, die 10 bestbewerteten, und Produkt nach ID
- Bewertungsmodul: Bewertungen erstellen, Bewertungen nach Produkt/Bewertung abrufen, Durchschnittsbewertung berechnen
- Suchmodul: Volltextsuche über Produktname, Version und Beschreibungen
- Prisma ORM: Typsichere Datenbankzugriffe mit MongoDB

## Installation

```bash
cd backend
npm install
```

## Konfiguration

Erstellen Sie eine `.env`-Datei:

```env
MONGODB_URI="mongodb://localhost:27017/agital-shop"
CORS_ORIGIN="https://agital-shop.vercel.app"
PORT="4000"
NODE_ENV="production"
```

## Datenbankeinrichtung

```bash
# Prisma-Client generieren
npm run prisma:generate

# Schema in die Datenbank übertragen
npm run prisma:push

# Datenbank mit Beispieldaten befüllen
npm run prisma:seed
```

## Ausführen

```bash
# Entwicklungsmodus mit Hot-Reload
npm run start:dev

# Produktionsmodus
npm run build
npm run start:prod
```

Das Backend läuft unter `http://localhost:4000`

## API-Endpunkte

### Produkte
- `GET /products` - Alle Produkte abrufen
- `GET /products?sort=latest` - 10 neueste Produkte
- `GET /products?sort=rating` - 10 bestbewertete Produkte
- `GET /products/:id` - Produkt nach ID abrufen

### Bewertungen
- `GET /reviews?productId=xxx` - Bewertungen für ein Produkt
- `GET /reviews?rating=5` - Bewertungen nach Bewertung filtern
- `GET /reviews/average?productId=xxx` - Durchschnittsbewertung abrufen
- `POST /reviews` - Neue Bewertung erstellen

### Suche
- `GET /search?q=super` - Produkte nach Schlüsselwort suchen

## Deployment auf Render (Docker)

- Variante Dockerfile (empfohlen):
  - Service: Web Service, Runtime: Docker, Kontext: `backend`
  - Environment:
    - `MONGODB_URI` (Atlas‑URI)
    - `CORS_ORIGIN` = `https://agital-shop.vercel.app`
    - `NODE_ENV` = `production`
  - Health Check: `Path` = `/products`
  - Start: `node dist/main.js` (über Dockerfile)
- Variante Image (optional):
  - Build: `docker build -t <user>/agital-backend:latest backend/`
  - Push: `docker push <user>/agital-backend:latest`
  - Render: Deploy from Image, gleiche Environment wie oben

## Docker Lokal

- Compose: `docker-compose.yml`
- Dienste: `mongo`, `backend`, `frontend`
- Start:
  - `docker compose up -d`
- Seed (optional):
  - `docker compose exec backend pnpm exec prisma db push`
  - `docker compose exec backend pnpm exec ts-node prisma/seed.ts`

## Troubleshooting

- `404` auf `/`: Normal, API hat keinen Root‑Handler; verwenden Sie `/products`, `/search`.
- Prisma/OpenSSL: Basisimage `node:20-slim` + `openssl`/`ca-certificates` installiert.
- Client Prisma: Vor Build `pnpm exec prisma generate` im Dockerfile.
- TypeScript Build: `tsconfig.build.json` kompiliert `src/**` nach `dist/`.
