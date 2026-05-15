import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  @Min(1)
  threadId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
