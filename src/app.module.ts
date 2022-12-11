import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';

@Module({
  imports: [GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: 'src/schema.gql',
    context: ({ req, res }) => ({
      headers: req.headers,
      req,
      res,
      url: req.protocol + '://' + req.headers.host,
    }),
    //typePaths: ['./**/*.graphql'],
    //path:"/",
  }), 
  UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
