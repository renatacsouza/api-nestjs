import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: "Isn't a valid name" })
  name: string;

  @IsNumber()
  age: number;

  @IsEmail({ message: "Isn't an e-mail" })
  email: string;

  @IsString({ message: "Isn't a valid description" })
  description: string;
}
