import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { TaskService } from '../../task.service';
import { CreateTaskDto } from '../../core/dto/create-task.dto';
import { UpdateTaskDto } from '../../core/dto/update-task.dto';
import { QueryTaskDto } from '../../core/dto/query-task.dto';
import {
  TaskResponseDto,
  SopResponseDto,
  SubtaskResponseDto,
} from '../../core/dto/task-response.dto';
import {
  ApiSuccessResponse,
  ApiSuccessArrayResponse,
} from '@common/decorators/api-response.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { Permissions } from '@common/decorators/permissions.decorator';
import { GetUser } from '@common/decorators/get-user.decorator';
import { JwtPayload } from '@modules/auth/core/interfaces/jwt-payload.interface';

@ApiTags('Task')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'task', version: '1' })
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Permissions('ADD_MARKETING_MONITORING')
  @ApiOperation({
    summary: 'Create Task & Checklist Subtasks (SRS Halaman 11-12)',
    description: 'Membuat tugas operasional sales utama beserta daftar checklist subtask terkait.',
  })
  @ApiSuccessResponse(TaskResponseDto)
  async create(
    @Body() createDto: CreateTaskDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.taskService.create(createDto, user);
  }

  @Get()
  @Permissions('VIEW_MARKETING_MONITORING')
  @ApiOperation({
    summary: 'Get All Tasks / search & filter',
    description: 'Menampilkan seluruh daftar tugas dengan filter PIC, status, prioritas, proyek terkait, dan keyword pencarian.',
  })
  @ApiSuccessArrayResponse(TaskResponseDto)
  async findAll(@Query() query: QueryTaskDto) {
    return this.taskService.findAll(query);
  }

  @Get('sop')
  @Permissions('VIEW_MARKETING_MONITORING')
  @ApiOperation({
    summary: 'Get list of external SOP links (SRS Halaman 13)',
    description: 'Mengumpulkan seluruh tautan referensi SOP aktif dari berbagai tugas.',
  })
  @ApiSuccessArrayResponse(SopResponseDto)
  async getSopLinks(): Promise<SopResponseDto[]> {
    return this.taskService.getSopLinks();
  }

  @Get(':id')
  @Permissions('VIEW_MARKETING_MONITORING')
  @ApiOperation({
    summary: 'Get Detail Task by ID',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiSuccessResponse(TaskResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @Permissions('UPDATE_MARKETING_MONITORING')
  @ApiOperation({
    summary: 'Update Task (dengan validasi hak akses PIC)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiSuccessResponse(TaskResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTaskDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.taskService.update(id, updateDto, user);
  }

  @Delete(':id')
  @Permissions('DELETE_MARKETING_MONITORING')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Task',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Task berhasil dihapus' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.taskService.remove(id, user);
  }

  @Patch(':id/subtask/:subtaskId')
  @Permissions('UPDATE_MARKETING_MONITORING')
  @ApiOperation({
    summary: 'Toggle Subtask Done/Undone status',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID Task utama' })
  @ApiParam({ name: 'subtaskId', type: Number, description: 'ID Subtask yang dicentang' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        is_done: { type: 'boolean', example: true },
      },
    },
  })
  @ApiSuccessResponse(SubtaskResponseDto)
  async toggleSubtask(
    @Param('id', ParseIntPipe) id: number,
    @Param('subtaskId', ParseIntPipe) subtaskId: number,
    @Body('is_done') isDone: boolean,
    @GetUser() user: JwtPayload,
  ) {
    return this.taskService.toggleSubtask(id, subtaskId, isDone, user);
  }
}
