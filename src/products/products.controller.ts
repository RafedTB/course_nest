import { Controller,Get,Post,Body,Param,NotFoundException,Put, Delete,ParseIntPipe,ValidationPipe } from "@nestjs/common";

import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";


@Controller("/api/products")
export class ProductsController {

    //this consider a bad practice method i will fix it later by using dependency injection
    private productsService: ProductsService = new ProductsService();
   

    @Post()
    public createNewProduct(@Body(new ValidationPipe()) body:CreateProductDto) {
        return this.productsService.createProduct(body);

    }
    @Get()
    public getAllProducts() {
        return this.productsService.getAll();
    }
    @Get(":id")
    public getProductById(@Param("id", ParseIntPipe) id: number) {
        return this.productsService.getOneBy(id);
    }
    @Put(":id")
    public updateProductById(@Param("id", ParseIntPipe) id: number, @Body(new ValidationPipe()) body:UpdateProductDto) {
        return this.productsService.update(id, body);
    }
    @Delete(":id")
    public deleteProductById(@Param("id", ParseIntPipe) id: number) {
        return this.productsService.delete(id);
    }
        

}