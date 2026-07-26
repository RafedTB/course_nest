import { IsString,IsNotEmpty, IsNumber,Min,Length, MinLength } from "class-validator";
export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(3,50)
    name: string = '';

    @IsString()
    @MinLength(5)
    description:string = '';
    
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price: number = 0;
}