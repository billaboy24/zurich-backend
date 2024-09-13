import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import {
  GetPricing,
  CreateProduct,
  UpdateProductID,
  UpdateProduct,
} from './dto/product';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
@ApiTags('Product')
@ApiBearerAuth()
@Controller('product')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':productCode/:location')
  @Roles('Guest', 'Admin')
  @ApiOperation({ summary: 'Get pricing by product code and location' })
  @ApiParam({ name: 'productCode', type: String, description: 'Product Code' })
  @ApiParam({ name: 'location', type: String, description: 'Location' })
  @ApiResponse({
    status: 200,
    description: 'Successfully receive price quote.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized request' })
  @ApiResponse({ status: 403, description: 'Forbidden request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findByProductCodeAndLocation(
    @Param() params: GetPricing,
  ): Promise<{ premium: string }> {
    try {
      return await this.productService.findall(params);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Could not find such product.',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create Product(Admin Only)' })
  @ApiBody({
    description: 'Create a new product',
    type: CreateProduct,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully receive price quote.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Unauthorized request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createProduct(@Body() createProduct: CreateProduct): Promise<Product> {
    console.log(createProduct);
    try {
      return await this.productService.create(createProduct);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Unable to create product. Please try again later.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Put(':productCode')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update Product(Admin Only)' })
  @ApiParam({ name: 'productCode', type: String, description: 'Product Code' })
  @ApiBody({
    description: 'Update a existing product',
    type: UpdateProduct,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully update product.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Unauthorized request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateProduct(
    @Param() params: UpdateProductID,
    @Body() updateProduct: UpdateProduct,
  ): Promise<Product> {
    const { productCode } = params;
    console.log(productCode);
    try {
      return await this.productService.update(productCode, updateProduct);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Unable to update product.Please provide valid credentials.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':productCode')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete product by product code.(Admin Only)' })
  @ApiParam({ name: 'productCode', type: String, description: 'Product Code' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted product',
  })
  @ApiResponse({ status: 403, description: 'Unauthorized request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteProduct(@Param() params: UpdateProductID): Promise<void> {
    try {
      const deleteProduct = await this.productService.delete(params);
      if (!deleteProduct) {
        throw new HttpException(
          'Could not find such product.',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to delete product.',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
