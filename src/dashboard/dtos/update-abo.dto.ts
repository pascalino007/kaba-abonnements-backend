import { Optional } from "@nestjs/common";
import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";
export class updateabodto {


   

     @IsNumber()  
     id : string ; 

     @IsNumber()
     status_payement : number ;

     @IsString()
     transaction_id : string ;
     
     
    





     

}