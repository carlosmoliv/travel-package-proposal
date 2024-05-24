import { Injectable } from '@nestjs/common';

import { RolesRepository } from './ports/roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}
}
