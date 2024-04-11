import { ArrayMaxSize, ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator"

export class NotificationDto {
    @IsNotEmpty()
    @IsMongoId()
    recipient: string

    @IsNotEmpty()
    @IsMongoId()
    blogId: string

    @IsNotEmpty()
    @IsString()
    content: string
}