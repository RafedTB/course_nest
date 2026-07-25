import { IsString,IsNotEmpty, IsNumber,Min,Length } from "class-validator";
export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(3,50)
    name: string = '';
    
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price: number = 0;
}