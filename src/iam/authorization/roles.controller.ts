import { Body, Controller, Post } from '@nestjs/common';

import { CreateRoleDto } from './dtos/create-role.dto';
import { RolesService } from './roles.service';
import { Public } from '../authentication/decorators/public.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Public()
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<void> {
    await this.rolesService.create(createRoleDto);
  }
}
