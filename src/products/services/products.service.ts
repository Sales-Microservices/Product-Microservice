import { Injectable, OnModuleInit, Logger, BadRequestException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

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
      throw new RpcException(`Product with id #${id} not found`);
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


  async validateIds(ids: number[]) {
    ids = Array.from(new Set(ids))

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids
        }

      }
    })

    if (products.length != ids.length) {
      throw new RpcException({
        message: 'Some Products Were not found',
        status: HttpStatus.BAD_REQUEST
      })
    }

    return products;
  }

}

