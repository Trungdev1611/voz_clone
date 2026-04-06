import { Controller, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./user.dto";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('register')
    async register(userdto: CreateUserDto) {
        return this.authService.register(userdto);
    }
}