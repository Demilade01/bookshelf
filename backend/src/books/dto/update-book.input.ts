import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateBookInput {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;
}

