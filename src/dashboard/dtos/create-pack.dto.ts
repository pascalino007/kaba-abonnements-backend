import { IsBoolean, IsDate, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";
export class createPackDto {
  
   @IsOptional()
  @IsNumber()
  id?: number;    // auto-generated, usually not set by client

  @IsString()
  name: string;

  @IsString()
  color: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  deliverylimit?: number;

  @IsNumber()
  @Min(0)
  radius_km: number;

  @IsNumber()
  @Min(0)
  min_order_amount: number; // was string in entity, better to enforce number

  @IsNumber()
  @IsPositive()
  duration_days: number;

  @IsBoolean()
  is_shareable: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  max_shared_users?: number;

  @IsNumber()
  @Min(0)
  discount_on_order: number;

  @IsOptional()
  @IsString()
  other_benefits?: string;

  @IsBoolean()
  is_active: boolean;

  @IsBoolean()
  is_enterprise: boolean;

  @IsOptional()
  createdAt?: Date; // will usually be auto-set by DB
  

}