import { IsNotEmpty, IsString } from 'class-validator';

export class CreateThreadDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  categorySlug: string;
}
