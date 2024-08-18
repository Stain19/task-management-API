import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from 'src/tasks/task-status.enum';
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
    const found_task = this.tasks.find(
      (task) => task.id === id && task.status !== TaskStatus.DELETED,
    );
    if (!found_task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found_task;
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
    const found_task: Task = this.getTaskById(id);
    if (found_task.status === TaskStatus.DELETED) {
      throw new HttpException(
        `The task with id ${id} it seems already deleted.`,
        HttpStatus.FORBIDDEN,
      );
    }
    found_task.status = TaskStatus.DELETED;
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
