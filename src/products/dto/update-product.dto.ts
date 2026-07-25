import { IsString, IsNumber, IsOptional, Length, Min } from "class-validator";
export class UpdateProductDto {
    @IsString()
    @IsOptional()
    @Length(3,50)
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description:string = '';

    @IsNumber()
    @IsOptional()
    @Min(0)
    @IsOptional()
    price?: number;
}