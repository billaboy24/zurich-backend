import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPricing {
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @IsString()
  @IsNotEmpty()
  location: string;
}

export class CreateProduct {
  @ApiProperty({
    description: 'The product code',
    example: '1000',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @ApiProperty({
    description: 'A description of the vehicle',
    example: 'Sports',
    required: false,
  })
  @IsString()
  productDesc: string;

  @ApiProperty({
    description: 'The location of vehicle',
    example: 'South Malaysia',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'The price of the product',
    example: '199.99',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  price: string;
}

export class UpdateProductID {
  @IsString()
  @IsNotEmpty()
  productCode: string;
}

export class UpdateProduct {
  @ApiProperty({
    description: 'The location of vehicle',
    example: 'North Malaysia',
    required: true,
  })
  @IsString()
  location: string;
  @ApiProperty({
    description: 'The price of the product',
    example: '399',
    required: true,
  })
  @IsString()
  price: string;
}
