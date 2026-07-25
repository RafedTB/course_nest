import { Column, Entity,CreateDateColumn,UpdateDateColumn,PrimaryGeneratedColumn} from "typeorm";

@Entity({name:'products'})
export class Product{
    @PrimaryGeneratedColumn()
    id:number;


    @Column({type:'varchar',length:50})
    name:string;

    @Column()
    description:string;

    @Column({type:'float'})
    price:number;

    @CreateDateColumn({type:'timestamp',default:()=>'CURRENT_TIMESTAMP(6)'})
    createdAt:Date;


    @UpdateDateColumn({type:'timestamp',default:()=>'CURRENT_TIMESTAMP(6)', onUpdate:'CURRENT_TIMESTAMP(6)'})
    updatedAt:Date;



}