import { Optional } from "@nestjs/common";
import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";
export class shared_userDto {

    @IsString()  
    code_suscription : string ; 
  
    @IsString()
    user_id : string ;

    @IsString()
    suscription_id : string ;
     
    

    





     

}