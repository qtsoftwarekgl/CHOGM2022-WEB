import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateProgrammeInput } from './create-programme.input';

@InputType()
export class UpdateProgrammeInput extends PartialType(CreateProgrammeInput) {
  @Field()
  programmeId: string;
}
