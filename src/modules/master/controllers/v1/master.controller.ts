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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MasterService } from '../../master.service';
import { CreateMitraDto, UpdateMitraDto } from '../../core/dto/mitra.dto';
import { CreateServiceDto, UpdateServiceDto } from '../../core/dto/service.dto';
import { CreateCategoryDto, UpdateCategoryDto } from '../../core/dto/category.dto';
import {
  MitraResponseDto,
  ServiceResponseDto,
  CategoryResponseDto,
} from '../../core/dto/master-response.dto';
import { ApiSuccessResponse, ApiSuccessArrayResponse } from '@common/decorators/api-response.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { Permissions } from '@common/decorators/permissions.decorator';

@ApiTags('Master Data')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'master', version: '1' })
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  // ============================================
  // MITRA ENDPOINTS
  // ============================================
  @Get('mitra')
  @ApiOperation({ summary: 'Get list of active Mitra (SCCIC, Urbansolv, dll)' })
  @ApiSuccessArrayResponse(MitraResponseDto)
  async findAllMitra(): Promise<MitraResponseDto[]> {
    return this.masterService.findAllMitra();
  }

  @Get('mitra/:id')
  @ApiOperation({ summary: 'Get detail Mitra by ID' })
  @ApiSuccessResponse(MitraResponseDto)
  async findMitraById(@Param('id', ParseIntPipe) id: number): Promise<MitraResponseDto> {
    return this.masterService.findMitraById(id);
  }

  @Post('mitra')
  @Permissions('ADD_MASTER_DATA')
  @ApiOperation({ summary: 'Create new Mitra' })
  @ApiSuccessResponse(MitraResponseDto)
  async createMitra(@Body() dto: CreateMitraDto): Promise<MitraResponseDto> {
    return this.masterService.createMitra(dto);
  }

  @Patch('mitra/:id')
  @Permissions('UPDATE_MASTER_DATA')
  @ApiOperation({ summary: 'Update Mitra by ID' })
  @ApiSuccessResponse(MitraResponseDto)
  async updateMitra(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMitraDto,
  ): Promise<MitraResponseDto> {
    return this.masterService.updateMitra(id, dto);
  }

  @Delete('mitra/:id')
  @Permissions('DELETE_MASTER_DATA')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Mitra (Soft Delete)' })
  @ApiResponse({ status: 200, description: 'Mitra deleted successfully' })
  async deleteMitra(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.masterService.deleteMitra(id);
  }

  // ============================================
  // SERVICES ENDPOINTS
  // ============================================
  @Get('services')
  @ApiOperation({ summary: 'Get list of Services with Categories (Product, Solution, Initiative)' })
  @ApiSuccessArrayResponse(ServiceResponseDto)
  async findAllServices(): Promise<ServiceResponseDto[]> {
    return this.masterService.findAllServices();
  }

  @Get('services/:id')
  @ApiOperation({ summary: 'Get detail Service by ID' })
  @ApiSuccessResponse(ServiceResponseDto)
  async findServiceById(@Param('id', ParseIntPipe) id: number): Promise<ServiceResponseDto> {
    return this.masterService.findServiceById(id);
  }

  @Post('services')
  @Permissions('ADD_MASTER_DATA')
  @ApiOperation({ summary: 'Create new Service' })
  @ApiSuccessResponse(ServiceResponseDto)
  async createService(@Body() dto: CreateServiceDto): Promise<ServiceResponseDto> {
    return this.masterService.createService(dto);
  }

  @Patch('services/:id')
  @Permissions('UPDATE_MASTER_DATA')
  @ApiOperation({ summary: 'Update Service by ID' })
  @ApiSuccessResponse(ServiceResponseDto)
  async updateService(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    return this.masterService.updateService(id, dto);
  }

  @Delete('services/:id')
  @Permissions('DELETE_MASTER_DATA')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Service (Soft Delete)' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  async deleteService(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.masterService.deleteService(id);
  }

  // ============================================
  // CATEGORIES ENDPOINTS
  // ============================================
  @Get('categories')
  @ApiOperation({ summary: 'Get list of Categories with optional filter by service_id' })
  @ApiQuery({ name: 'service_id', required: false, type: Number, description: 'Filter category by service ID' })
  @ApiSuccessArrayResponse(CategoryResponseDto)
  async findAllCategories(
    @Query('service_id') serviceId?: string,
  ): Promise<CategoryResponseDto[]> {
    const parsedServiceId = serviceId ? parseInt(serviceId, 10) : undefined;
    return this.masterService.findAllCategories(parsedServiceId);
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get detail Category by ID' })
  @ApiSuccessResponse(CategoryResponseDto)
  async findCategoryById(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
    return this.masterService.findCategoryById(id);
  }

  @Post('categories')
  @Permissions('ADD_MASTER_DATA')
  @ApiOperation({ summary: 'Create new Category' })
  @ApiSuccessResponse(CategoryResponseDto)
  async createCategory(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.masterService.createCategory(dto);
  }

  @Patch('categories/:id')
  @Permissions('UPDATE_MASTER_DATA')
  @ApiOperation({ summary: 'Update Category by ID' })
  @ApiSuccessResponse(CategoryResponseDto)
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.masterService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @Permissions('DELETE_MASTER_DATA')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Category (Soft Delete)' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.masterService.deleteCategory(id);
  }
}
