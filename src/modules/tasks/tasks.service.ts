import prisma from '../../prisma';
import { CreateTaskInput, UpdateTaskInput, TaskListQueryInput } from './tasks.validation';

export class TasksService {
  /**
   * Creates a new task.
   */
  public static async createTask(userId: string, input: CreateTaskInput) {
    return prisma.task.create({
      data: {
        userId,
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      },
    });
  }

  /**
   * Retrieves user tasks applying filters, search, sorting, and pagination.
   */
  public static async getTasks(userId: string, query: TaskListQueryInput) {
    const where: any = {
      userId,
    };

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.search) {
      const searchLower = query.search.trim();
      where.OR = [
        { title: { contains: searchLower, mode: 'insensitive' } },
        { description: { contains: searchLower, mode: 'insensitive' } },
      ];
    }

    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      totalCount,
    };
  }

  /**
   * Fetches a specific user task by UUID.
   */
  public static async getTaskById(userId: string, taskId: string) {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });
  }

  /**
   * Updates an existing user task.
   */
  public static async updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
    // Verify first if task exists and belongs to user
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const data: any = {
      ...input,
    };

    if (input.dueDate !== undefined) {
      data.dueDate = input.dueDate ? new Date(input.dueDate) : null;
    }

    return prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  /**
   * Deletes a user task.
   */
  public static async deleteTask(userId: string, taskId: string) {
    // Verify first if task exists and belongs to user
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    await prisma.task.delete({
      where: { id: taskId },
    });
  }
}
