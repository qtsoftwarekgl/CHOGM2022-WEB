import { ECMSTypes, EQAtypes } from '@chogm2022/enums';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { AbstractState } from '../../utils/abstract/abstract-track.entity';

@InputType()
export class OtherInfoInput {
  @Field({ nullable: true })
  contactPhone: string;

  @Field({ nullable: true })
  contactEmail: string;

  @Field({ nullable: true })
  website: string;

  @Field({ nullable: true })
  pdfFile: string;
}

@InputType()
export class CreateCmsInput extends AbstractState {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field(() => ECMSTypes)
  category?: ECMSTypes;

  @Field(() => EQAtypes, { nullable: true })
  qaType?: EQAtypes;

  @Field(() => OtherInfoInput, { nullable: true })
  otherInfo?: OtherInfoInput;
}

registerEnumType(ECMSTypes, { name: 'ECMSTypes' });
registerEnumType(EQAtypes, { name: 'EQAtypes' });
