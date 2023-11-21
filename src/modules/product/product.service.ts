import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/shared/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);

    return product;
  }

  public async findAll() {
    return await this.productRepository.find();
  }

  public async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    return product;
  }

  public async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    Object.assign(product, updateProductDto);
    await this.productRepository.save(product);

    return product;
  }

  public async remove(id: string) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    await this.productRepository.delete(id);

    return product;
  }
}
