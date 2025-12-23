import { Controller, Get, Param, Query, BadRequestException } from "@nestjs/common"
import { ProductsService } from "./products.service"

@Controller("products")
export class ProductsController {
  /**
   * Controller für Produkt-Endpunkte.
   * Bietet Routen zum Abrufen aller Produkte, Top 10 nach Datum/Bewertung
   * sowie zum Abrufen eines einzelnen Produkts per ID.
   */
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  /**
   * Gibt Produkte zurück.
   * Wenn `sort=latest`: neueste 10 Produkte.
   * Wenn `sort=rating`: 10 bestbewertete Produkte (nach Durchschnittsbewertung).
   * Ohne Sortierung: alle Produkte, absteigend nach Erstellungsdatum.
   */
  async getProducts(@Query('sort') sort?: string) {
    if (sort === "latest") {
      return this.productsService.getLatest10()
    }
    if (sort === "rating") {
      return this.productsService.getBestRated10()
    }
    return this.productsService.getAll()
  }

  @Get(':id')
  /**
   * Gibt ein Produkt anhand seiner ID zurück.
   * Validiert die ID (24-stellige Hex-Zeichenfolge);
   * wirft `BadRequestException` bei ungültiger ID.
   */
  async getProductById(@Param('id') id: string) {
    if (!id || id === 'undefined' || !/^[a-fA-F0-9]{24}$/.test(id)) {
      throw new BadRequestException('Invalid product id')
    }
    return this.productsService.getById(id);
  }
}
