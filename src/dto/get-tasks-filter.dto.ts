import { TaskStatus } from 'src/tasks/task.model';

export class GetTasksFilterDTO {
  status?: TaskStatus;
  search?: string;
}
