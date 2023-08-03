import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CatType {
  @Field(() => String)
  name: string;

  @Field(() => Number)
  count: number;
}

@ObjectType()
class GenderType {
  @Field(() => Number)
  total: number;

  @Field(() => Number)
  male: number;

  @Field(() => Number)
  female: number;

  @Field(() => Number)
  other: number;

  @Field(() => Number)
  none: number;
}

@ObjectType()
export class CmsStat {
  @Field(() => Number)
  registered: number;

  @Field(() => [CatType])
  categories: CatType[];

  @Field(() => [GenderType])
  gender: GenderType[];
}

@ObjectType()
export class AllStats {
  @Field(() => CmsStat)
  women: CmsStat;

  @Field(() => CmsStat)
  youth: CmsStat;

  @Field(() => CmsStat)
  people: CmsStat;

  @Field(() => CmsStat)
  business: CmsStat;

  @Field(() => CmsStat)
  chogm: CmsStat;

  @Field(() => CmsStat)
  media: CmsStat;
}
