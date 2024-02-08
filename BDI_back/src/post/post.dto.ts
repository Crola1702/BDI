import { IsNotEmpty, IsString, IsNumber} from "class-validator";

export class PostDto {
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsString()
    contactPhone: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    contractType: string; // TODO - Change with Enumerate?
    
    @IsString()
    tags: string;
}

