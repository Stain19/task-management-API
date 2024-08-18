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
  getTasks(@Query() filterDto: GetTasksFilterDTO): Task[] {
    if (Object.keys(filterDto).length) {
      return this.taskService.getTasksWithFilter(filterDto);
    } else {
      return this.taskService.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.taskService.createTask(createTaskDTO);
  }
  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.taskService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDTO,
  ): Task {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status);
  }
}
