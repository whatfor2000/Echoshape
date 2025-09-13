import { IsNotEmpty } from "@nestjs/class-validator";

export class CreateRegisterDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    password: string
}
