import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import {
  GetPricing,
  CreateProduct,
  UpdateProduct,
  UpdateProductID,
} from './dto/product';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findall(getPricing: GetPricing): Promise<{ premium: string }> {
    const { productCode, location } = getPricing;
    try {
      const response = await this.productRepository.find({
        where: { productCode, location },
      });
      if (!response || response.length === 0) {
        throw new NotFoundException(
          'No products found for the given criteria.',
        );
      }
      // console.log(typeof response[0].price);
      return { premium: response[0].price };
    } catch (error) {
      console.log(error);
      throw new Error('Failed to retrieve product price.');
    }
  }
  async create(createProduct: CreateProduct): Promise<Product> {
    // console.log(createProduct);
    try {
      const newProduct = this.productRepository.create(createProduct);
      return await this.productRepository.save(newProduct);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to create product');
    }
  }
  async update(productCode: string, product: UpdateProduct): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { productCode },
    });
    if (!existingProduct) {
      throw new NotFoundException(`Product with code ${productCode} not found`);
    }

    try {
      await this.productRepository.update({ productCode }, product);
      return await this.productRepository.findOne({
        where: { productCode },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to update product');
    }
  }
  async delete(updateProductId: UpdateProductID): Promise<boolean> {
    const { productCode } = updateProductId;
    const result = await this.productRepository.delete({ productCode });

    if (result.affected === 0) {
      throw new NotFoundException(`Product with code ${productCode} not found`);
    }

    return result.affected > 0;
  }
}
