import { Module } from "@nestjs/common"
import { ProductsModule } from "./products/products.module"
import { ReviewsModule } from "./reviews/reviews.module"
import { SearchModule } from "./search/search.module"
import { PrismaModule } from "./prisma/prisma.module"

@Module({
  imports: [PrismaModule, ProductsModule, ReviewsModule, SearchModule],
})
export class AppModule {}
