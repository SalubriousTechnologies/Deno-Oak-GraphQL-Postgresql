import { Application, applyGraphQL, Router } from "./deps.ts";
import { types } from "./schema/typeDefs.ts";
import { resolvers } from "./resolvers/resolvers.ts";

const GraphQLService = await applyGraphQL<Router>({
  path: "/graphql",
  Router,
  typeDefs: types,
  resolvers: resolvers,
  context: (_ctx) => {
    return { user: "User" };
  },
});

const app = new Application();

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log("Server start at http://localhost:8080");
await app.listen({ port: 8080 });
