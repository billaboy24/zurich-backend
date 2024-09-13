import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import {
  BadRequestException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { GetPricing, CreateProduct } from './dto/product';
import { RolesGuard } from '../roles/roles.guard';
import { Reflector } from '@nestjs/core';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findall: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        Reflector,
        RolesGuard,
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  describe('findByProductCodeAndLocation', () => {
    it('should return the price of the product', async () => {
      const result = { premium: '100' };
      jest.spyOn(service, 'findall').mockResolvedValue(result);

      const getPricing: GetPricing = { productCode: 'P001', location: 'NY' };
      expect(await controller.findByProductCodeAndLocation(getPricing)).toEqual(
        result,
      );
    });

    it('should throw NotFoundException if no products are found', async () => {
      jest.spyOn(service, 'findall').mockRejectedValue(new NotFoundException());

      const getPricing: GetPricing = { productCode: 'P001', location: 'NY' };
      await expect(
        controller.findByProductCodeAndLocation(getPricing),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException if an error occurs', async () => {
      jest.spyOn(service, 'findall').mockRejectedValue(new Error('Error'));

      const getPricing: GetPricing = { productCode: 'P001', location: 'NY' };
      await expect(
        controller.findByProductCodeAndLocation(getPricing),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('createProduct', () => {
    it('should create a product and return it', async () => {
      const createProductDto: CreateProduct = {
        productCode: 'P001',
        productDesc: 'test',
        location: 'NY',
        price: '100',
      };
      const result: Product = {
        ...createProductDto,
        id: 0,
      };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.createProduct(createProductDto)).toEqual(result);
    });

    it('should throw BadRequestException if creation fails', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException());

      const createProductDto: CreateProduct = {
        productCode: 'P001',
        productDesc: 'test',
        location: 'NY',
        price: '100',
      };
      await expect(controller.createProduct(createProductDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
