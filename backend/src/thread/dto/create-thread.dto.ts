import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateThreadDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  categorySlug: string;

  @IsInt()
  @Min(1)
  authorId: number;
}
