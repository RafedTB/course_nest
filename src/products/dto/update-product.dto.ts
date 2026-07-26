import { IsString, IsNumber, IsOptional, Length, Min, MinLength } from "class-validator";
export class UpdateProductDto {
    @IsString()
    @IsOptional()
    @Length(3,50)
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    @MinLength(5)
    description?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @IsOptional()
    price?: number;
}