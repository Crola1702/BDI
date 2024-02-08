import { IsNotEmpty, IsNumber, IsString } from "class-validator";
export class LocationDto {

    @IsNumber()
    @IsNotEmpty()
    readonly latitude: number;

    @IsNumber()
    @IsNotEmpty()
    readonly longitude: number;

}
