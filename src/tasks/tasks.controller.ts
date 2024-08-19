import {
  Controller,
  Delete,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from 'src/tasks/task-status.enum';
import { CreateTaskDTO } from 'src/dto/create-task.dto';
import { GetTasksFilterDTO } from 'src/dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from 'src/dto/update-task-status.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  private taskService: TasksService;

  constructor(taskService: TasksService) {
    this.taskService = taskService;
  }

  @Get()
  async getTasks(@Query() filterDto: GetTasksFilterDTO): Promise<Task[]> {
    return this.taskService.getTasks(filterDto);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Post()
  async createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.taskService.createTask(createTaskDTO);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<Task> {
    return this.taskService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDTO,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status);
  }
}
