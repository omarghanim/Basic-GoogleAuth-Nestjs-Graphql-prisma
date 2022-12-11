import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field(() => Date, { nullable: true })
    birthDate?: Date

    @Field({ nullable: true })
    nationality?: string;

    @Field({ nullable: true })
    gender?: string;

    @Field({ nullable: true })
    picture?: string;

    @Field()
    type:string

    @Field(() => Int)
    tokenVersion?: number;

    @Field(() => Date, { nullable: true })
    createdAt?: Date;

    @Field(() => Date, { nullable: true })
    updatedAt?: Date;
}

@ObjectType()
export class AuthPayload {
    @Field()
    accessToken: string;
    @Field({ nullable: true })
    refreshToken?: string;
}
