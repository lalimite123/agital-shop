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
DATABASE_URL="mongodb://localhost:27017/agital-shop"
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
