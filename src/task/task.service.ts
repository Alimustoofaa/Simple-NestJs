import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { EmptyError } from 'rxjs';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) { }
   
    async getTask(
        filterDto: GetTaskFilterDto,
        user: User,
    ): Promise<Task[]> {
        return this.taskRepository.getTask(filterDto, user);
    }

    async getTaskById(
        id: number,
        user: User,
    ): Promise<Task> {
        const result = await this.taskRepository.findOne({ where: { id, userId: user.id } } );
        if (!result) {
            throw new NotFoundException(`Task with '${id}' not found`);
        }
        return result;
    }

    async deleteTask(
        id: number,
        user: User,
    ): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id });
        
        if (result.affected === 0) {
            throw new NotFoundException(`Task with '${id}' not found`);
        }
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user)
    }

    async updateTaskStatus(
        id: number, 
        status: TaskStatus,
        user: User,
    ): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }
}
