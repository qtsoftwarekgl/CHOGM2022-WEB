import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateCmsInput } from './create-cms.input';

@InputType()
export class UpdateCmsInput extends PartialType(CreateCmsInput) {
  @Field()
  cmsId: string;
}
