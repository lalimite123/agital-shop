import { IsString, IsInt, Min, Max, IsNotEmpty } from "class-validator"

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  text: string

  @IsString()
  @IsNotEmpty()
  productId: string
}
