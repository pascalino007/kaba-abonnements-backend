import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAboHistoryDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  subscription_id: string;

  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @IsString()
  @IsNotEmpty()
  codeAbonnement: string;

  @IsString()
  @IsNotEmpty()
  PrixAbo: string;

  @IsString()
  @IsNotEmpty()
  Nom_users: string;

  @IsString()
  @IsNotEmpty()
  Num_commande_used: string;
}
