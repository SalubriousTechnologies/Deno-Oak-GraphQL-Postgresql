// deno run --allow-net  deno-graphql.ts
// Server start at http://localhost:8080

import { Application } from "./deps.ts";
import { GraphQLService } from "./server.ts";
// import { resolvers } from './resolvers/resolvers.ts';

const app = new Application();

// const GraphQLService = await applyGraphQL<Router>({
//   path: '/graphql',
//   Router,
//   typeDefs: types,
//   resolvers: mainResolver,
//   context: (ctx) => {
//     // this line is for passing a user context for the auth
//     return { user: "Vivek" };
//   }
// });

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log("Server start at http://localhost:8080");
await app.listen({ port: 8080 });
