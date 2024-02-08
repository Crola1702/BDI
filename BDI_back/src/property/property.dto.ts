import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PropertyDto {

    @IsNotEmpty()
    @IsNumber()
    area: number;

    @IsNotEmpty()
    @IsString()
    readonly address: string;
}
