import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDTO } from 'src/dto/create-task.dto';
import { GetTasksFilterDTO } from 'src/dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTasksFilterDTO): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        return task.title.includes(search) || task.description.includes(search);
      });
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find(
      (task) => task.id === id && task.status !== TaskStatus.DELETED,
    );
  }

  createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): void {
    const task = this.tasks.find((task) => task.id === id);
    if (task === null) {
      throw new HttpException(
        `Cannot find task with id ${task.id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (task.status === TaskStatus.DELETED) {
      throw new HttpException(
        `The task with id ${task.id} it seems already deleted.`,
        HttpStatus.FORBIDDEN,
      );
    }
    task.status = TaskStatus.DELETED;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task: Task = this.getTaskById(id);
    if (task) {
      task.status = status;
      return task;
    } else {
      throw new HttpException(
        `Cannot find task with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
