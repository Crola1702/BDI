import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
export class UserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly role: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly verifiedUser: boolean;

  @IsBoolean()
  @IsNotEmpty()
  readonly approvedForSale: boolean;
}
