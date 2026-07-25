import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";


type ProductType = {
    id: number;
    name: string;
    price: number;
};
@Injectable()
export class ProductsService {

    private products: ProductType[] = [
        {id:1, name: "Product 1", price: 10.99},
        {id:2, name: "Product 2", price: 19.99},
        {id:3, name: "Product 3", price: 5.99},
    ];

        /**
         * create new product
         */
        public createProduct({name, price}:CreateProductDto) {
            const newProduct: ProductType = {
                id: this.products.length + 1,
                name,
                price
            };
            this.products.push(newProduct);
            return newProduct;
        }


        /**
         * get all products
         */
       
        public getAll() {
            return this.products;

        }

        /**
         * get one product by id
         */
        
        public getOneBy(id: number) {
            console.log(typeof id);
            
            const product =this.products.find(p=> p.id === (id));
            if(!product) {
                throw new NotFoundException(`Product with id ${id} not found`);
            }else {
            return product;
            }
        }


        /**
         * Update product by id
         */
        
        public update(id: number, UpdateProductDto:UpdateProductDto) {
            
            const productIndex = this.products.findIndex(p=> p.id === (id));
            if(productIndex === -1) {
                throw new NotFoundException(`Product with id ${id} not found`);
            }
            const updatedProduct = {
                ...this.products[productIndex],
                ...UpdateProductDto
            };
            this.products[productIndex] = updatedProduct;
            return updatedProduct;
        }





        /**
         * Delete product by id
         */

        
        
        public delete( id: number) {
            const productIndex = this.products.findIndex(p=> p.id === (id));
            if(productIndex === -1) {
                throw new NotFoundException(`Product with id ${id} not found`);
            }
            const deletedProduct = this.products[productIndex];
            this.products.splice(productIndex, 1);
            return deletedProduct;
        }
            
}