import { EUserRole } from '@chogm2022/enums';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';

@InputType()
export class RoleInput {
  @Field(() => EUserRole)
  role: EUserRole;
}

@InputType()
export class RolesInput {
  @Field(() => [EUserRole])
  roles: EUserRole[];
}

registerEnumType(EUserRole, { name: 'EUserRole' });
