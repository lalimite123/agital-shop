import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class ProductsService {
  /**
   * Service für Produktzugriffe über Prisma.
   * Stellt Methoden zum Abrufen aller Produkte, der 10 neuesten,
   * der 10 bestbewerteten sowie eines Produkts per ID bereit.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Holt alle Produkte inkl. zugehöriger Bewertungen,
   * absteigend nach `createdAt` sortiert.
   */
  async getAll() {
    return this.prisma.product.findMany({
      include: { reviews: true },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Holt die 10 neuesten Produkte inkl. Bewertungen,
   * sortiert nach `createdAt` absteigend.
   */
  async getLatest10() {
    return this.prisma.product.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { reviews: true },
    })
  }

  /**
   * Ermittelt die 10 bestbewerteten Produkte.
   * Berechnet die Durchschnittsbewertung je Produkt aus seinen Bewertungen
   * und gibt die Top 10 nach durchschnittlicher Bewertung zurück.
   */
  async getBestRated10() {
    const products = await this.prisma.product.findMany({
      include: { reviews: true },
    })

    // Durchschnittsbewertung pro Produkt berechnen
    const productsWithAvg = products.map((product) => {
      const avgRating =
        product.reviews.length > 0 ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length : 0
      return { ...product, avgRating }
    })

    // Nach Durchschnittsbewertung sortieren und Top 10 zurückgeben
    return productsWithAvg.sort((a, b) => b.avgRating - a.avgRating).slice(0, 10)
  }

  /**
   * Holt ein Produkt per ID inkl. Bewertungen.
   * Wirft `NotFoundException`, wenn kein Produkt gefunden wurde.
   */
  async getById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { reviews: true },
    })

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`)
    }

    return product
  }
}
