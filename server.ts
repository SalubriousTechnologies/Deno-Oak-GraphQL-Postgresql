import { applyGraphQL } from "./dependencies/oak-graphql-deps.ts";
import { Router, RouterContext } from "./dependencies/oak-deps.ts";
import { typeDefs } from './schema/typeDefs.ts';
import { resolvers } from './resolvers/resolvers.ts';


export const GraphQLService = await applyGraphQL<Router>({
    Router,
    typeDefs,
    resolvers,
    context: (ctx) => {
      // this line is for passing a user context for the auth
      return { user: "Vivek" };
    }
});