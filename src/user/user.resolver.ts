import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../utils/auth.guard';
import { AuthPayload, User } from './user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
    constructor(private readonly userService:UserService){}

    @Mutation(() => AuthPayload)
    async authenticateWithGoogle(@Args('token') token: string, @Context() context):Promise<AuthPayload> {
        return this.userService.authenticate(token, context.res)
    }

    @Query(() => User)
    @UseGuards(new AuthGuard())
    async me(@Context('user') user): Promise<User> {
        return await this.userService.me(user.userId);
    }
}
