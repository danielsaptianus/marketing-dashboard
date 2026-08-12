import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateMitraDto, UpdateMitraDto } from './core/dto/mitra.dto';
import { CreateServiceDto, UpdateServiceDto } from './core/dto/service.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './core/dto/category.dto';
import {
  MitraResponseDto,
  ServiceResponseDto,
  CategoryResponseDto,
} from './core/dto/master-response.dto';

@Injectable()
export class MasterService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // MITRA METHODS
  // ============================================
  async findAllMitra(): Promise<MitraResponseDto[]> {
    return this.prisma.mitra.findMany({
      where: { deleted_at: null },
      orderBy: { id: 'asc' },
    });
  }

  async findMitraById(id: number): Promise<MitraResponseDto> {
    const mitra = await this.prisma.mitra.findFirst({
      where: { id, deleted_at: null },
    });
    if (!mitra) {
      throw new NotFoundException(`Mitra dengan ID ${id} tidak ditemukan`);
    }
    return mitra;
  }

  async createMitra(dto: CreateMitraDto): Promise<MitraResponseDto> {
    return this.prisma.mitra.create({
      data: dto,
    });
  }

  async updateMitra(id: number, dto: UpdateMitraDto): Promise<MitraResponseDto> {
    await this.findMitraById(id);
    return this.prisma.mitra.update({
      where: { id },
      data: dto,
    });
  }

  async deleteMitra(id: number): Promise<{ message: string }> {
    await this.findMitraById(id);
    await this.prisma.mitra.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { message: `Mitra dengan ID ${id} berhasil dihapus` };
  }

  // ============================================
  // SERVICE METHODS
  // ============================================
  async findAllServices(): Promise<ServiceResponseDto[]> {
    return this.prisma.service.findMany({
      where: { deleted_at: null },
      include: {
        categories: {
          where: { deleted_at: null },
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findServiceById(id: number): Promise<ServiceResponseDto> {
    const service = await this.prisma.service.findFirst({
      where: { id, deleted_at: null },
      include: {
        categories: {
          where: { deleted_at: null },
          orderBy: { id: 'asc' },
        },
      },
    });
    if (!service) {
      throw new NotFoundException(`Service dengan ID ${id} tidak ditemukan`);
    }
    return service;
  }

  async createService(dto: CreateServiceDto): Promise<ServiceResponseDto> {
    const existing = await this.prisma.service.findUnique({
      where: { service_name: dto.service_name },
    });
    if (existing) {
      throw new ConflictException(`Service '${dto.service_name}' sudah ada`);
    }
    return this.prisma.service.create({
      data: dto,
      include: { categories: true },
    });
  }

  async updateService(id: number, dto: UpdateServiceDto): Promise<ServiceResponseDto> {
    await this.findServiceById(id);
    if (dto.service_name) {
      const existing = await this.prisma.service.findUnique({
        where: { service_name: dto.service_name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Service '${dto.service_name}' sudah digunakan`);
      }
    }
    return this.prisma.service.update({
      where: { id },
      data: dto,
      include: { categories: true },
    });
  }

  async deleteService(id: number): Promise<{ message: string }> {
    await this.findServiceById(id);
    await this.prisma.service.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { message: `Service dengan ID ${id} berhasil dihapus` };
  }

  // ============================================
  // CATEGORY METHODS
  // ============================================
  async findAllCategories(serviceId?: number): Promise<CategoryResponseDto[]> {
    return this.prisma.category.findMany({
      where: {
        deleted_at: null,
        ...(serviceId ? { service_id: serviceId } : {}),
      },
      include: {
        service: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findCategoryById(id: number): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findFirst({
      where: { id, deleted_at: null },
      include: {
        service: true,
      },
    });
    if (!category) {
      throw new NotFoundException(`Category dengan ID ${id} tidak ditemukan`);
    }
    return category;
  }

  async createCategory(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const service = await this.prisma.service.findFirst({
      where: { id: dto.service_id, deleted_at: null },
    });
    if (!service) {
      throw new BadRequestException(`Service ID ${dto.service_id} tidak valid atau tidak ditemukan`);
    }
    return this.prisma.category.create({
      data: dto,
      include: { service: true },
    });
  }

  async updateCategory(id: number, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    await this.findCategoryById(id);
    if (dto.service_id) {
      const service = await this.prisma.service.findFirst({
        where: { id: dto.service_id, deleted_at: null },
      });
      if (!service) {
        throw new BadRequestException(`Service ID ${dto.service_id} tidak valid`);
      }
    }
    return this.prisma.category.update({
      where: { id },
      data: dto,
      include: { service: true },
    });
  }

  async deleteCategory(id: number): Promise<{ message: string }> {
    await this.findCategoryById(id);
    await this.prisma.category.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { message: `Category dengan ID ${id} berhasil dihapus` };
  }
}
