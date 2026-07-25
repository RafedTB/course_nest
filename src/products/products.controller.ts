import { Controller,Get,Post,Body,Param,NotFoundException,Put, Delete,ParseIntPipe,ValidationPipe } from "@nestjs/common";

import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

type ProductType = {
    id: number;
    name: string;
    price: number;
};
@Controller("/api/products")
export class ProductsController {
    private products: ProductType[] = [
        {id:1, name: "Product 1", price: 10.99},
        {id:2, name: "Product 2", price: 19.99},
        {id:3, name: "Product 3", price: 5.99},
    ];





    @Post()
    public createNewProduct(@Body(new ValidationPipe()) body:CreateProductDto) {
        const newProduct: ProductType = {
            id: this.products.length + 1,
            name: body.name,
            price: body.price
        };
        this.products.push(newProduct);
        return newProduct;
    }
    @Get()
    public getAllProducts() {
        return this.products;
    }
    @Get(":id")
    public getProductById(@Param("id", ParseIntPipe) id: number) {
        console.log(typeof id);
        
        const product =this.products.find(p=> p.id === (id));
        if(!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }else {
        return product;
        }
    }
    @Put(":id")
    public updateProductById(@Param("id", ParseIntPipe) id: number, @Body(new ValidationPipe()) body:UpdateProductDto) {
        console.log(body);
        const productIndex = this.products.findIndex(p=> p.id === (id));
        if(productIndex === -1) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        const updatedProduct = {
            ...this.products[productIndex],
            ...body
        };
        this.products[productIndex] = updatedProduct;
        return updatedProduct;
    }
    @Delete(":id")
    public deleteProductById(@Param("id", ParseIntPipe) id: number) {
        const productIndex = this.products.findIndex(p=> p.id === (id));
        if(productIndex === -1) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        const deletedProduct = this.products[productIndex];
        this.products.splice(productIndex, 1);
        return deletedProduct;
    }
        

}