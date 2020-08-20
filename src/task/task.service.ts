import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { EmptyError } from 'rxjs';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) { }
    // private task: Task[] = [];

    // getAllTask(): Task[] {
    //     return this.task;
    // }

    // getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
    //     const { status, search } = filterDto;

    //     let task = this.getAllTask();
    //     if (status) {
    //         task = task.filter(task => task.status === status);
    //         if (!task.length) {
    //             throw new NotFoundException(`Task with status "${status}" not found`)
    //         };
    //     }
    //     if (search) {
    //         task = task.filter(task =>
    //             task.title.includes(search) ||
    //             task.description.includes(search),
    //         );
    //         if (!task.length) {
    //             throw new NotFoundException(`Task with keyword  "${search}" not found`)
    //         };
    //     }
    //     return task;
    // }

    async getTaskById(id: number): Promise<Task> {
        const result = await this.taskRepository.findOne(id);
        if (!result) {
            throw new NotFoundException(`Task with '${id}' not found`);
        }
        return result;
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        
        if (result.affected === 0) {
            throw new NotFoundException(`Task with '${id}' not found`);
        }
    }
    
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto)
    }

    // updateTaskStatus(id: string, status: TaskStatus): Task {
    //     const task = this.getTaskById(id);
    //     task.status = status
    //     return  task;
    // }
}
