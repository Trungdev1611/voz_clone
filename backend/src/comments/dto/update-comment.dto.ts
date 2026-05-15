import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;
}
