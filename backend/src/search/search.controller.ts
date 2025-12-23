import { Controller, Get, Query, BadRequestException } from "@nestjs/common"
import { SearchService } from "./search.service"

@Controller("search")
export class SearchController {
  /**
   * Controller für Such-Endpunkte.
   * Stellt eine Route bereit, die eine Volltextsuche auf Produkten ausführt.
   */
  constructor(private readonly searchService: SearchService) {}

  @Get()
  /**
   * Führt eine Suche mit dem Query-Parameter `q` aus.
   * Validiert, dass die Suchanfrage nicht leer ist,
   * und delegiert an `SearchService.fullTextSearch`.
   */
  async search(@Query('q') query: string) {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException("Search query cannot be empty")
    }
    return this.searchService.fullTextSearch(query)
  }
}
