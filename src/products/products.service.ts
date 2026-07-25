import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";


type ProductType = {
    id: number;
    name: string;
    price: number;
};
@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>) {}

   

        /**
         * create new product
         */
        public async createProduct(dto:CreateProductDto) {
            const product = this.productRepository.create(dto);
            return await this.productRepository.save(product);
        }


        /**
         * get all products
         */
       
        public async getAll() {
            return await this.productRepository.find();
        }

        /**
         * get one product by id
         */
        
        public async getOneBy(id: number) {
            const product = await this.productRepository.findOne({ where: { id } });
            if (!product) {
                throw new NotFoundException(`Product with id ${id} not found`);
            }
            return product;
        }


        /**
         * Update product by id
         */
        
        public async update(id: number, UpdateProductDto:UpdateProductDto) {
            const product = await this.getOneBy(id);
            Object.assign(product, UpdateProductDto);
            return await this.productRepository.save(product);
        }

        /**
         * Delete product by id
         */
    
        public async delete(id: number) {
            const product = await this.getOneBy(id);
            await this.productRepository.remove(product);
            return { message: `Product with id ${id} has been deleted` };

        }
            
}