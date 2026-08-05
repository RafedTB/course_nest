import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import { Product } from './product.entity';
import { usersService } from '../users/users.service';




describe('ProductsService', () => {
    let productService: ProductsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {provide:usersService, useValue:{}},
                {provide:getRepositoryToken(Product), useValue:{}}
            ]
        }).compile();
        productService = module.get<ProductsService>(ProductsService);
    });

    it('should be defined', () => {
        expect(productService).toBeDefined();
    });
})