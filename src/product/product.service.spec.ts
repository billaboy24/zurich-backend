import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  describe('findall', () => {
    it('should return product price if products found', async () => {
      const result = [{ price: '100' }];
      jest.spyOn(repository, 'find').mockResolvedValue(result as any);

      const pricing = { productCode: 'P001', location: 'NY' };
      expect(await service.findall(pricing)).toEqual({ premium: '100' });
    });

    it('should throw NotFoundException if no products found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const pricing = { productCode: 'P001', location: 'NY' };
      await expect(service.findall(pricing)).rejects.toThrow(
        'Failed to retrieve product price.',
      );
    });

    it('should throw an Error if repository.find fails', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('Error'));

      const pricing = { productCode: 'P001', location: 'NY' };
      await expect(service.findall(pricing)).rejects.toThrow(
        'Failed to retrieve product price.',
      );
    });
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const product = {
        id: 1,
        productCode: 'P001',
        productDesc: 'Testing',
        location: 'NY',
        price: '100',
      };
      jest.spyOn(repository, 'create').mockReturnValue(product as any);
      jest.spyOn(repository, 'save').mockResolvedValue(product as any);

      expect(await service.create(product)).toEqual(product);
    });

    it('should throw BadRequestException if creation fails', async () => {
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Error'));

      const product = {
        id: 1,
        productCode: 'P001',
        productDesc: 'Testing',
        location: 'NY',
        price: '100',
      };
      await expect(service.create(product)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
