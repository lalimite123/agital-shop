import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class SearchService {
  /**
   * Service für Volltextsuche über Produkte.
   * Nutzt Prisma, um Produkte zu laden, und filtert sie anhand des Suchbegriffs.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Führt eine einfache Volltextsuche aus.
   * Normalisiert den Suchbegriff (Kleinschreibung), lädt Produkte inkl. Bewertungen
   * und filtert nach Name, Version, Kurz- und Langbeschreibung.
   */
  async fullTextSearch(query: string) {
    const searchTerm = query.toLowerCase()

    const products = await this.prisma.product.findMany({
      include: { reviews: true },
    })

    // Produkte filtern, die dem Suchbegriff entsprechen
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.version.toLowerCase().includes(searchTerm) ||
        product.shortDescription.toLowerCase().includes(searchTerm) ||
        product.longDescription.toLowerCase().includes(searchTerm),
    )
  }
}
