import { Optional } from "@nestjs/common";
import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";
export class OrderDto {


   
    @IsString()  
    user_id : string ; 

    @IsString()
    subscription_id : string ;   

    @IsString()
    codeAbo : string ;

    @IsString()
    command_id : string ;

}