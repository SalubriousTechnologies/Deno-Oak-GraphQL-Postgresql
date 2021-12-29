Install Deno and Postgresql

<a href="https://github.com/SalubriousTechnologies/Deno-Oak-GraphQL-Postgresql/blob/main/deno_ins_cmd.md" target="_blank"> Deno Installation Link </a>

**Create a database in PostGreSql**

To run a docker instance of postgresql you can execute the following command

```
docker run -d --rm --name graphql-postgres -e POSTGRES_PASSWORD=pass123 -p 5432:5432 -e POSTGRES_USER=pathuser postgres
```

Create a table `user_tbl` with the following fields:

- id as serial
- userName as text
- country as text
- email as text
- contact as interger
- address as text
- priority as text

You can create the table and the fields by executing the following query in pgadmin or pgsql:

```
CREATE DATABASE path_basti;
CREATE TABLE user_tbl(
  id serial,
  userName  text,
	country  text,
	email  text,
	contact  integer,
	address  text,
	priority  text,
	pincode integer,
   PRIMARY KEY( id)
);
```

**Add dependencies (Oak framework and GraphQL and PostGresQL middleware)**

```

export { Application, Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
export type {
  Middleware,
  RouterContext,
} from "https://deno.land/x/oak@v10.1.0/mod.ts";
export {
  applyGraphQL,
  gql,
} from "https://deno.land/x/oak_graphql@0.6.3/mod.ts";
export { Client } from "https://deno.land/x/postgres@v0.14.2/mod.ts";

```

**client.ts file code (This is connection file with postGresQL)**

```
import { Client } from "../deps.ts";

const client = {
  user: "pathuser",
  password: "pass123",
  database: "path_basti",
  hostname: "localhost",
  port: 5432,
};

export const psqlClient = new Client(client);
```

# Create schema using gql

```
enum Priority {
  LOW
  MEDIUM
  HIGH
}

interface Address {
  address: String
  country: String
  pincode: Int
}

union SearchResult = User | Department

type Department{
  id: ID!
  name: String
}
type User implements Address {
  id: ID!
  userName: String
  email: String
  contact: Int
  address: String
  country: String
  pincode: Int
  priority:  Priority!
}

input UserInput {
  userName: String
  email: String
  contact: Int
  address: String!
  country: String
  priority: Priority!
}



type Query {
  getUsers(id :ID, userName: String): [User]
  editUser(input: UserInput, id:ID): [User]
}
type Mutation{
  addUser(input: UserInput): [User]
}

```

# Define resolver, Query and Mutation

mutations.ts

```
import { psqlClient } from "../db/client.ts";
import { processData } from "../util/cleanup.ts";

export const Mutation = {
  addUser: async (
    _parent: unknown,
    { ...data }: any,
    context: any,
    info: any,
  ) => {
    const args = data.input;
    let retstr = processData(args, "add");
    const instRec = await psqlClient.queryObject(
      "insert into user_tbl " + retstr + "  returning *",
    );
    return instRec.rows;
  },
  editUser: async (
    _parent: unknown,
    { ...data }: any,
    context: any,
    info: any,
  ) => {
    const args = data.input;
    let retstr = processData(args, "edit");
    await psqlClient.queryObject(
      "UPDATE  user_tbl SET " + retstr + " WHERE id='" + data.id + "'",
    );
    const results = await psqlClient.queryObject(
      "select * from user_tbl where id='" + data.id + "';",
    );
    return results.rows;
  },
  deleteUser: async (
    parent: any,
    { ...data }: any,
    context: any,
    info: any,
  ) => {
    const results = await psqlClient.queryObject(
      "delete from user_tbl where id='" + data.id + "';",
    );
    return [{ "message": "Record is deleted" }];
  },
};
```

queries.ts

```
import { psqlClient } from "../db/client.ts";
import { removeLastChar } from "../util/cleanup.ts";

export const Query = {
  getUsers: async (_parent: unknown, args: any, context: any, info: any) => {
    let sql = "";

    let order = "";
    if ("order" in args) {
      order = 'ORDER BY "' + args.order.colName + '" ' + args.order.orderBy +
        " ";
    }
    if ("limit" in args) {
      order = " LIMIT " + args.limit.limit;
    }

    if (Object.keys(args).indexOf("where") === -1) {
      sql = "select * from user_tbl " + order + ";";
    } else {
      let where = " WHERE ";
      let inpt = args.where;
      Object.keys(inpt).map((key) =>
        where += ' "' + key + '"' + "='" + inpt[key] + "' AND"
      );
      let retstr = removeLastChar(where);
      sql = "select * from user_tbl " + retstr + " " + order + ";";
    }
    const results = await psqlClient.queryObject(sql);
    return results.rows;
  },
};
```

resolvers.ts

```
import { Query } from "./queries.ts";
import { Mutation } from "./mutations.ts";

export const resolvers = {
  Query,
  Mutation,
};
```

# Add GraphQLService

```
const GraphQLService = await applyGraphQL<Router>({
  path: '/graphql',
  Router,
  typeDefs: types,
  resolvers: resolvers,
  context: (ctx) => {
    return { user: "User" };
  }
});

```

# Create Oak server

```
const app = new Application();
app.use(GraphQLService.routes(), GraphQLService.allowedMethods());
console.log("Server start at http://localhost:8080");
await app.listen({ port: 8080 });

```

# Access query

**Fetch Query**

```
query{
	getUsers{
		id,
		userName
		email
		contact
	}
}


response


{
	"data": {
		"getUsers": [
			{
				"id": "53",
				"userName": "Vivek Ranjan Pandey",
				"email": "raman@gmail.com",
				"contact": 4554
			}
		]
	}
}

```

**Insert Query**

```


Mutation

	mutation{
		addUser(input:{
			userName: "Vinay",
			email:"raman@gmail.com",
			country: "india",
			address:"Dih Ganjari Gangapur",
			contact:4554554,
			priority:HIGH
		}){
			id,
			userName
			email
		}
	}

Response

{
	"data": {
		"addUser": [

			{
				"id": "59",
				"userName": "Vinay",
				"email": "raman@gmail.com"

			}
		]
	}
}


```

# Edit User Query

```

mutation{
   editUser(input:{
     userName: "Vinay",
     email:"raman@gmail.com",
     country: "india",
     address:"Dih Ganjari Gangapur",
     contact:4554554,
     priority:HIGH
  }, id:54){
    id,
    userName
    email

  }


}

Respons

{
    "data": {
        "editUser": [
            {
                "id": "54",
                "userName": "Vinay",
                "email": "raman@gmail.com"
            }
        ]
    }
}

```

```

query{
	getUsers(where:{email:"vivek@gmail.com", id:6}, order: {colName:"id",orderBy:"desc"}){
		id,
		userName
		email
		contact
	}
}
```
