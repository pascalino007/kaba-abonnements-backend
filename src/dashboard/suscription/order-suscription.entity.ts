import { UsingJoinTableIsNotAllowedError } from "typeorm"
import { Pack } from "../pack/pack.entity"

/* Nous avons besoin de gerer 

Commande 
Abonnement
Pack

du coup il faut etre capable  afficjer 

1- Le client id 
2- Le pack quil Utilise 
3- La date de son insciption 
4 - Nb livraison utilise 
5- Son code danbonnement 

Ainsi pour voir le nombre de livraisons restante il faut compter
 le nombre de livraison fais sous abonnemnent pour ce client  */