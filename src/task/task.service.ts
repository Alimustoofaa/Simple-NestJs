import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
    private task: Task[] = [];

    getAllTask(): Task[] {
        return this.task;
    }

    getTaskById(id: string): Task {
        return this.task.find(task => task.id === id);
    }

    deleteTaskById(id: string): void {
       this.task = this.task.filter(task => task.id !== id);
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN,
        }

        this.task.push(task);
        return task
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status
        return  task;
    }
}
