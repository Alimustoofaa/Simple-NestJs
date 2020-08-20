import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { EmptyError } from 'rxjs';

@Injectable()
export class TaskService {
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

    // getTaskById(id: string): Task {
    //     const result = this.task.find(task => task.id === id);
    //     if (!result) {
    //        throw new NotFoundException(`Task with '${id}' not found`);
    //     }
    //     return result;
    // }

    // deleteTaskById(id: string): void {
    //     const result = this.getTaskById(id);
    //     this.task = this.task.filter(task => task.id !== result.id);
    // }

    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto;
    //     const task: Task = {
    //         id: uuidv4(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     }

    //     this.task.push(task);
    //     return task
    // }

    // updateTaskStatus(id: string, status: TaskStatus): Task {
    //     const task = this.getTaskById(id);
    //     task.status = status
    //     return  task;
    // }
}
