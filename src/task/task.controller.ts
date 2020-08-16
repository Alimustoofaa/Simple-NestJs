import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get()
    getAllTask(): Task[] {
        return this.taskService.getAllTask();
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.taskService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): void{
        return this.taskService.deleteTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.taskService.createTask(createTaskDto);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body('status') status: TaskStatus
    ): Task {
        return this.taskService.updateTaskStatus(id, status);
    }
}
