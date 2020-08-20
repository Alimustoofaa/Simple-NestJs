import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { TaskStatus } from "./task-status.enum";

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column() tittle: string;
    @Column() description: string;
    @Column() status: TaskStatus;
}