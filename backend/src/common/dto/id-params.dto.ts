import { Type } from "class-transformer";
import { IsPositive } from "class-validator";
import { IsNumber } from "class-validator/types/decorator/typechecker/IsNumber";

export class IdParamDto {
//   @ApiProperty({ example: 1, description: "id của item muốn lấy thông tin" })
  @Type(() => Number)   // 👈 Auto transform string -> number
  @IsNumber()
  @IsPositive()
  id: number;
}