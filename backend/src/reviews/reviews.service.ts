import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateReviewDto } from "./dto/create-review.dto"

@Injectable()
export class ReviewsService {
  /**
   * Service für Bewertungszugriffe über Prisma.
   * Stellt Methoden zum Abrufen, zur Durchschnittsberechnung und zum Erstellen von Bewertungen bereit.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Holt Bewertungen optional gefiltert nach `productId` und/oder `rating`.
   * Gibt Ergebnisse absteigend nach `createdAt` zurück und inkludiert das zugehörige Produkt.
   */
  async getReviews(productId?: string, rating?: number) {
    const where: any = {}

    if (productId) {
      where.productId = productId
    }

    if (rating !== undefined) {
      where.rating = rating
    }

    return this.prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { product: true },
    })
  }

  /**
   * Berechnet die Durchschnittsbewertung für ein Produkt.
   * Gibt Durchschnitt (auf eine Dezimalstelle gerundet) und Anzahl der Bewertungen zurück.
   */
  async calculateAverage(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
    })

    if (reviews.length === 0) {
      return { productId, average: 0, count: 0 }
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    const average = sum / reviews.length

    return {
      productId,
      average: Math.round(average * 10) / 10,
      count: reviews.length,
    }
  }

  /**
   * Erstellt eine neue Bewertung.
   * Prüft zuvor, ob das referenzierte Produkt existiert; wirft `NotFoundException` falls nicht.
   * Gibt die erstellte Bewertung inkl. Produkt zurück.
   */
  async create(data: CreateReviewDto) {
    // Produkt-Existenz prüfen
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    })

    if (!product) {
      throw new NotFoundException(`Product with ID ${data.productId} not found`)
    }

    return this.prisma.review.create({
      data,
      include: { product: true },
    })
  }
}
