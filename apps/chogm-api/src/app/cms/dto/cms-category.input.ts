import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ECMSTypes } from '@chogm2022/enums';

@InputType()
export class CmsCategoryInput {
  @Field(() => ECMSTypes)
  category?: ECMSTypes;
}

registerEnumType(ECMSTypes, { name: 'ECMSTypes' });
