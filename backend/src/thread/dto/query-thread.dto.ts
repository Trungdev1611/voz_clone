import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginateAndSearchDTO } from 'src/common/dto/pagination-and-search.dto';

export class QueryThreadDto extends PaginateAndSearchDTO {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'voz-seed-forum-thoi-su' })
  categorySlug?: string;
}
