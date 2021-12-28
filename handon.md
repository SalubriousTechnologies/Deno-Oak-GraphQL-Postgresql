Install Deno and Postgresql

**Create a database in PostGreSql**
  Create a table user_tbl

  Fields is

  ```
  id as serial
  userName as text
  country as text
  email as text
  contact as interger
  address as text
  priority as text


  ```


**Add dependencies (Oak framework and GraphQL and PostGresQL middile-were)**


```

import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { applyGraphQL, gql } from "https://deno.land/x/oak_graphql/mod.ts";
import {psqlClient} from './psql-connect.ts';

```

**psql-connect.ts file code (This is connection file with postGresQL)**

```
	import { Client } from "https://deno.land/x/postgres/mod.ts";
	const client = {
	  user: "pathuser",
	  password: "pass123", 
	  database: "path_basti",
	  hostname: "localhost",
	  port: 5432,  
	};

	const psqlClient =  new Client(client);
	export {
	  psqlClient,
	}
```



# Create schema using qgl

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
}
type Mutation{
  addUser(input: UserInput): [User]
}

```

#  Define resolver, Query and Mutation

```

const resolvers = {
  Query: {
    getUsers: async (parent: any,args: any, context: any, info: any) => { 
      let sql = '';     
      if(Object.keys(args).length === 0 && args.constructor === Object){
        sql = "select * from user_tbl;";
      }else{
        let where = ' WHERE ';
        Object.keys(args).map((key) => where+=' "'+key +'"'+"='"+args[key]+"' AND" );         
        let res = where.split(" ");  //split by space
        res.pop();  //remove last element
        let retstr = res.join(" ");          
        sql = "select * from user_tbl "+retstr+";";        
      }
      const  results = await psqlClient.queryObject(sql);
      return results.rows;        
    }
  },
  Mutation: {
    addUser:  async (parent: any,{...data}:any, context: any, info: any) => {
      const instRec = await psqlClient.queryObject("insert into user_tbl (\"userName\", \"country\", \"email\", \"contact\", \"address\",\"priority\") values ('"+data.input.userName+"','"+data.input.country+"','"+data.input.email+"','"+data.input.contact+"','"+data.input.address+"','"+data.input.priority+"')  returning *");
      return instRec.rows;      
    }
  },

}

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
