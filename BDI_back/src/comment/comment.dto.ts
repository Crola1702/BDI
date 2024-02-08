import { IsNotEmpty, IsString } from "class-validator";

export class CommentDto {

    @IsString()
    @IsNotEmpty()
    readonly comment: string;

    @IsString()
    @IsNotEmpty()
    readonly type: string;
}


