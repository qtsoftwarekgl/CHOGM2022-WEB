import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConvidResult {
  @Field({ nullable: true })
  testResult: string;

  @Field({ nullable: true })
  testType: string;

  @Field({ nullable: true })
  testDate: string;
}
