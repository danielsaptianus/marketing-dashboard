import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateTaskDto } from './core/dto/create-task.dto';
import { UpdateTaskDto } from './core/dto/update-task.dto';
import { QueryTaskDto } from './core/dto/query-task.dto';
import { TaskResponseDto, SopResponseDto } from './core/dto/task-response.dto';
import { JwtPayload } from '@modules/auth/core/interfaces/jwt-payload.interface';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // 1. CREATE TASK WITH OPTIONAL SUBTASKS
  // ============================================
  async create(dto: CreateTaskDto, user: JwtPayload) {
    const {
      title,
      description,
      priority = 'Medium',
      status = 'Pending',
      due_date,
      pic_id,
      pic_name,
      sop_link,
      marketing_monitoring_id,
      subtasks = [],
    } = dto;

    // Validate project relation if provided
    if (marketing_monitoring_id) {
      const project = await this.prisma.marketingMonitoring.findFirst({
        where: { id: marketing_monitoring_id, deleted_at: null },
      });
      if (!project) {
        throw new BadRequestException(`Sales monitoring ID ${marketing_monitoring_id} tidak valid`);
      }
    }

    const assignedPicId = pic_id || (typeof user.userId === 'number' ? user.userId : 1);
    const assignedPicName = pic_name || user.name || user.email;

    return this.prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          title,
          description: description || null,
          priority,
          status,
          due_date: due_date ? new Date(due_date) : null,
          pic_id: assignedPicId,
          pic_name: assignedPicName,
          sop_link: sop_link || null,
          marketing_monitoring_id: marketing_monitoring_id || null,
          subtasks: {
            create: subtasks.map((sub) => ({
              title: sub.title,
            })),
          },
        },
        include: {
          subtasks: true,
          marketing_monitoring: true,
        },
      });

      return task;
    });
  }

  // ============================================
  // 2. FIND ALL / SEARCH & FILTER
  // ============================================
  async findAll(query: QueryTaskDto) {
    const {
      pic_id,
      status,
      priority,
      marketing_monitoring_id,
      search,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {
      deleted_at: null,
    };

    if (pic_id) where.pic_id = pic_id;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (marketing_monitoring_id) where.marketing_monitoring_id = marketing_monitoring_id;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          subtasks: true,
        },
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // ============================================
  // 3. FIND ONE
  // ============================================
  async findOne(id: number) {
    const task = await this.prisma.task.findFirst({
      where: { id, deleted_at: null },
      include: {
        subtasks: {
          orderBy: { id: 'asc' },
        },
        marketing_monitoring: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task dengan ID ${id} tidak ditemukan`);
    }

    return task;
  }

  // ============================================
  // 4. UPDATE TASK (WITH OWNERSHIP RULE)
  // ============================================
  async update(id: number, dto: UpdateTaskDto, user: JwtPayload) {
    const existing = await this.findOne(id);

    // Ownership validation (Sales Admin only edits their own tasks)
    this.checkOwnership(existing.pic_id, user);

    const {
      title,
      description,
      priority,
      status,
      due_date,
      pic_id,
      pic_name,
      sop_link,
      marketing_monitoring_id,
    } = dto;

    if (marketing_monitoring_id) {
      const project = await this.prisma.marketingMonitoring.findFirst({
        where: { id: marketing_monitoring_id, deleted_at: null },
      });
      if (!project) {
        throw new BadRequestException(`Sales monitoring ID ${marketing_monitoring_id} tidak valid`);
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(due_date !== undefined && { due_date: due_date ? new Date(due_date) : null }),
        ...(pic_id && { pic_id }),
        ...(pic_name !== undefined && { pic_name }),
        ...(sop_link !== undefined && { sop_link }),
        ...(marketing_monitoring_id !== undefined && { marketing_monitoring_id }),
      },
      include: {
        subtasks: true,
      },
    });
  }

  // ============================================
  // 5. DELETE TASK
  // ============================================
  async remove(id: number, user: JwtPayload) {
    const existing = await this.findOne(id);

    this.checkOwnership(existing.pic_id, user);

    await this.prisma.task.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return { message: `Task ID ${id} berhasil dihapus` };
  }

  // ============================================
  // 6. TOGGLE SUBTASK
  // ============================================
  async toggleSubtask(taskId: number, subtaskId: number, isDone: boolean, user: JwtPayload) {
    const task = await this.findOne(taskId);
    this.checkOwnership(task.pic_id, user);

    const subtask = await this.prisma.subtask.findFirst({
      where: { id: subtaskId, task_id: taskId },
    });

    if (!subtask) {
      throw new NotFoundException(`Subtask ID ${subtaskId} tidak ditemukan di Task ID ${taskId}`);
    }

    return this.prisma.subtask.update({
      where: { id: subtaskId },
      data: { is_done: isDone },
    });
  }

  // ============================================
  // 7. GET SOP LINKS (SRS Halaman 13)
  // ============================================
  async getSopLinks(): Promise<SopResponseDto[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        deleted_at: null,
        sop_link: { not: null },
      },
      orderBy: { created_at: 'desc' },
    });

    return tasks.map((t) => ({
      task_id: t.id,
      task_title: t.title,
      sop_link: t.sop_link!,
      pic_name: t.pic_name || 'Daniel',
    }));
  }

  // ============================================
  // PRIVATE HELPER: OWNERSHIP CHECK
  // ============================================
  private checkOwnership(picId: number, user: JwtPayload) {
    const role = user.role?.toLowerCase() || '';
    const userId = typeof user.userId === 'number' ? user.userId : parseInt(String(user.userId), 10) || 1;

    const isPrivileged =
      role.includes('admin') && !role.includes('sales') ||
      role.includes('head') ||
      role.includes('super');

    if (!isPrivileged && picId !== userId) {
      throw new ForbiddenException(
        'Akses ditolak: Anda hanya dapat mengubah atau menghapus tugas yang ditugaskan kepada Anda.',
      );
    }
  }
}
