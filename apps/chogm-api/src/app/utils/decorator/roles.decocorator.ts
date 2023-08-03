import { EUserRole } from '@chogm2022/enums';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'role';
export const Roles = (...role: EUserRole[]) => SetMetadata(ROLES_KEY, role);
