import { Test } from '@nestjs/testing';
import { async } from 'rxjs';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockuser = { id: 1, username: 'Test user'};

const mockTaskRepository = () => ({
	getTask: jest.fn(),
	findOne: jest.fn(),
	createTask: jest.fn(),
	delete: jest.fn(),
	getTaskById: jest.fn(),
	save: jest.fn(),
});

describe('TaskService',  () => {
	let taskService;
	let taskRepository;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				TaskService,
				{ provide: TaskRepository, useFactory: mockTaskRepository }
			],
		}).compile();

		taskService = await module.get<TaskService>(TaskService);
		taskRepository = await module.get<TaskRepository>(TaskRepository);
	});

	describe('getTask', () => {
		it('Gets all task from the repository', async () => {
			taskRepository.getTask.mockResolvedValue('someValue');
			const filters: GetTaskFilterDto = { status : TaskStatus.DONE, search: 'nest'}
			const results = await taskService.getTask(filters, mockuser);
			expect(taskRepository.getTask).toHaveBeenCalled();
			expect(results).toEqual('someValue');
		});
	});

	describe('getTaskById', () => {
		it('call taskRepository.findOne(), and succesfully retrieve and return the task', async () => {
			const mockTask = { title: 'Test Task', description: 'Test desc'};
			taskRepository.findOne.mockResolvedValue(mockTask);

			const result = await taskService.getTaskById(1, mockuser);
			expect(result).toEqual(mockTask);

			expect(taskRepository.findOne).toHaveBeenCalledWith({ 
				where: {
					 id: 1,
					 userId: mockuser.id
				}
			});
		});

		it('throws an error as task is not found', () => {
			taskRepository.findOne.mockResolvedValue(null);
			expect(taskService.getTaskById(1, mockuser)).rejects.toThrow(NotFoundException);
			
		});
	});

	describe('createTask', () => {
		it('call task.Repository.createTask() and return the result', async () => {
			taskRepository.createTask.mockResolvedValue('someTask');

			expect(taskRepository.createTask).not.toHaveBeenCalled();
			const mockTask = { title: 'Test Task', description: 'Test desc', status: TaskStatus.OPEN };
			const result = await taskService.createTask(mockTask, mockuser);
			expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask, mockuser);
			expect(result).toEqual('someTask');

		});
	});

	describe('deleteTask', () => {
		it('call taskRepository.deleteTask() and delete a task', async () => {
			taskRepository.delete.mockResolvedValue({ affacred: 1 });
			expect(taskRepository.delete).not.toHaveBeenCalled();
			await taskService.deleteTask(1, mockuser);
			expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockuser.id});
		});

		it('throw and error as task not found', () => {
			taskRepository.delete.mockResolvedValue({ affacred: 0 });
			expect(taskService.deleteTask(1, mockuser)).rejects.toThrow(NotFoundException);
		});
	});

	describe('updateTask', () => {
		it('call taskRepository.updateTask() and update a task', async () => {
			const save = jest.fn().mockResolvedValue(true)
			taskService.getTaskById = jest.fn().mockResolvedValue({
				status: TaskStatus.IN_PROGRESS,
				save,
			});

			expect(taskService.getTaskById).not.toHaveBeenCalled();
			expect(save).not.toHaveBeenCalled();
			
			const result = await taskService.updateTaskStatus( 1, TaskStatus.DONE, mockuser);
			expect(taskService.getTaskById).toHaveBeenCalled();
			expect(save).toHaveBeenCalled();
			expect(result.status).toEqual(TaskStatus.DONE);
		});
	});
});