import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');

  }

  create(createProductDto: CreateProductDto) {

    return this.product.create({
      data: createProductDto
    });

  }

  async findAll(paginationDto: PaginationDto) {

    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;


    return this.product.findMany({
      skip: (page - 1) * limit,
      take: limit
    })
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true }
    });

    if (!product) {
      throw new NotFoundException(`Product with id #${id} not found`);
    }

    return product;

  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: __, ...data } = updateProductDto;


    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: data,
    });


  }

  async remove(id: number) {

    await this.findOne(id);

    const product = await this.product.update({
      where: { id },
      data: {
        available: false
      }
    });

    return product;

  }
}
