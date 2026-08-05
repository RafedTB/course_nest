import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import { Product } from './product.entity';
import { usersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';




describe('ProductsService', () => {
    let productService: ProductsService;
    let productRepository: Repository<Product>;
    const REPOSITORY_TOKEN = getRepositoryToken(Product);
    const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'This is a test product',
        price: 100
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide:usersService,
                    useValue:{
                        getCurrentUser: jest.fn((userId:number) => Promise.resolve({id:userId}))

                    }
                },
                {
                    provide: REPOSITORY_TOKEN,
                    useValue: {
                        create: jest.fn((dto:CreateProductDto) => dto),
                        save: jest.fn((dto:CreateProductDto) => Promise.resolve({id:1,...dto})),
                    }
                }
            ]
        }).compile();
        productService = module.get<ProductsService>(ProductsService);
        productRepository = module.get<Repository<Product>>(REPOSITORY_TOKEN);
    });

    it('should be defined', () => {
        expect(productService).toBeDefined();
    });
    it('should have a product repository', () => {
        expect(productRepository).toBeDefined();
    });
    describe('createProduct', () => {
        it('should call "create" to create a new product', async () => {
            await productService.createProduct(createProductDto, 1);
            expect(productRepository.create).toHaveBeenCalled();
            expect(productRepository.create).toHaveBeenCalledTimes(1);
        });

         it('should call "save" to save the new product', async () => {
            await productService.createProduct(createProductDto, 1);
            expect(productRepository.save).toHaveBeenCalled();
            expect(productRepository.save).toHaveBeenCalledTimes(1);
        });

        it("should create a new product and return it", async () => {
            const result = await productService.createProduct(createProductDto, 1);
            expect(result).toBeDefined();
            expect(result.name).toBe("Test Product");
            expect(result.description).toBe("This is a test product");
            expect(result.price).toBe(100);
        });
    })
})