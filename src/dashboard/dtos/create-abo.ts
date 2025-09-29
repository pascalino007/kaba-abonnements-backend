import { Optional } from "@nestjs/common";
import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";
export class suscriptionDto {


   
    @IsString()  
    user_id : string ; 

    @IsString()
    subscription_id : string ;   

    @IsString()
    start_date : string ;

     @IsString()
     payement_method : string ;
     
     @IsString()
     transaction_id : string
     
    

    





     

}