import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {

    @IsPositive()
    @IsOptional()
    @IsNumber()
    page?: number;

    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    limit?: number;

}