import { EUserRole } from '@chogm2022/enums';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { AbstractState } from '../../utils/abstract/abstract-track.entity';

@InputType()
export class CreateUserInput extends AbstractState {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(() => [EUserRole])
  role: EUserRole[];

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  age?: number;

  @Field({ defaultValue: '' })
  avatar?: string;

  @Field({ nullable: true })
  biography?: string;

  @Field(() => [Number], { nullable: true })
  rating?: number[];

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  status?: boolean;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  dateOfBirth?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  passport?: string;

  @Field({ nullable: true })
  nationality?: string;

  @Field({ nullable: true })
  occupation?: string;

  @Field({ nullable: true })
  residenceCountry?: string;

  @Field({ nullable: true })
  company?: string;

  @Field({ nullable: true })
  qrcodeData?: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  showNoc: boolean;
}

registerEnumType(EUserRole, { name: 'EUserRole' });
