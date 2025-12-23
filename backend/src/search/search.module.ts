import { Module } from "@nestjs/common"
import { SearchController } from "./search.controller"
import { SearchService } from "./search.service"

@Module({
  controllers: [SearchController],
  providers: [SearchService],
})
/**
 * NestJS-Modul für die Produktsuche.
 * Registriert den `SearchController` und den `SearchService`.
 */
export class SearchModule {}
