import { IsBoolean, IsDate, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";
export class updatePackDto {
  
   @IsOptional()
  @IsNumber()
  id: number;    // auto-generated, usually not set by client
  
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  deliverylimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  radius_km: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  min_order_amount: number; // was string in entity, better to enforce number

  @IsOptional()
  @IsNumber()
  @IsPositive()
  duration_days: number;

  @IsOptional()
  @IsBoolean()
  is_shareable: boolean;



  @IsOptional()
  @IsNumber()
  @Min(1)
  max_shared_users?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount_on_order: number;

 
  @IsOptional()
  @IsString()
  other_benefits?: string;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @IsOptional()
  @IsBoolean()
  is_enterprise: boolean;

  @IsOptional()
  createdAt?: Date; // will usually be auto-set by DB
  

}