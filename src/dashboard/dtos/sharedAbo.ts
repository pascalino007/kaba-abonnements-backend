import { Optional } from "@nestjs/common";
import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";
export class sharedAbo {

    @IsString()  
    user_id : string ; 

    @IsString()
    Code : string ;   
}