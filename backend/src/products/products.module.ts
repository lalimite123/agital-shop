import { Module } from "@nestjs/common"
import { ProductsController } from "./products.controller"
import { ProductsService } from "./products.service"

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
/**
 * NestJS-Modul für Produkte.
 * Registriert den `ProductsController` und den `ProductsService` und
 * exportiert den Service für die Verwendung in anderen Modulen.
 */
export class ProductsModule {}
