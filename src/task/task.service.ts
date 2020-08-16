import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TaskService {
    private task: Task[] = [];

    getAllTask(): Task[] {
        return this.task;
    }

    createTask(title: string, description: string): Task {
        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN,
        }

        this.task.push(task);
        return task
    }
}
