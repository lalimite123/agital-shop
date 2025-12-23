import { Controller, Get, Post, Body, Query, BadRequestException } from "@nestjs/common"
import { ReviewsService } from "./reviews.service"
import { CreateReviewDto } from "./dto/create-review.dto"

@Controller("reviews")
export class ReviewsController {
  /**
   * Controller für Bewertungs-Endpunkte.
   * Bietet Routen zum Abrufen von Bewertungen, zur Durchschnittsberechnung
   * sowie zum Erstellen neuer Bewertungen.
   */
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  /**
   * Gibt Bewertungen zurück, optional gefiltert.
   * Filter: `productId` (Bewertungen eines Produkts), `rating` (numerische Bewertung).
   * Antwort ist nach `createdAt` absteigend sortiert und enthält zugehöriges Produkt.
   */
  async getReviews(@Query('productId') productId?: string, @Query('rating') rating?: string) {
    const ratingNum = rating ? Number.parseInt(rating, 10) : undefined
    return this.reviewsService.getReviews(productId, ratingNum)
  }

  @Get("average")
  /**
   * Berechnet die Durchschnittsbewertung für ein Produkt.
   * Erwartet `productId` als Query-Parameter; wirft Fehler, wenn nicht angegeben.
   */
  async getAverage(@Query('productId') productId: string) {
    if (!productId) {
      throw new BadRequestException("productId is required")
    }
    return this.reviewsService.calculateAverage(productId)
  }

  @Post()
  /**
   * Erstellt eine neue Bewertung anhand der übergebenen Daten.
   * Validierung und Produkt-Existenzprüfung erfolgen im Service.
   */
  async createReview(@Body() data: CreateReviewDto) {
    return this.reviewsService.create(data);
  }
}
