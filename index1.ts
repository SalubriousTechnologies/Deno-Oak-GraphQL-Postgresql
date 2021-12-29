import { Application, Router } from "./deps.ts";
import { applyGraphQL, gql } from "./deps.ts";
import { psqlClient } from "./db/psql-connect.ts";

const types = gql`

enum Priority {
  LOW
  MEDIUM
  HIGH
}
enum OrderType{
  DESC
  ASC
}

interface Address {
  address: String  
  country: String
  pincode: Int
}


type Department{
  id: ID!
  name: String
}
type User implements Address {
  id: ID!
  userName: String
  email: String!  
  contact: Int
  address: String  
  country: String
  pincode: Int
  priority:  Priority!  
}

input UserInput {
  userName: String
  email: String!
  contact: Int
  address: String!
  country: String
  priority: Priority!
  pincode: Int!
}

input UserEdit {
  userName: String!  
  contact: Int!
  address: String!
  country: String
  priority: Priority!
  pincode: Int!
}

type Delete{
  message: String!
}

input where{
  id : ID
  userName: String
  email: String
}
input order{
  colName: String!
  orderBy: OrderType!
}
input limit{
  limit: Int!
}


type Query {
  getUsers(id :ID, userName: String, where: where, order: order, limit: limit): [User] 
}
type Mutation{
  addUser(input: UserInput): [User]
  editUser(input: UserEdit, id:ID): [User]
  deleteUser(id:ID): [Delete]
}



`;

function removeLastChar(args: any) {
  let res = args.split(" "); //split by space
  res.pop(); //remove last element
  return res.join(" ");
}

function processData(args: any, type: String) {
  let setData = "";
  let retstr = "";
  if (type == "edit") {
    Object.keys(args).map((key) =>
      setData += ' "' + key + '"' + "='" + args[key] + "' ,"
    );
    retstr = removeLastChar(setData);
  } else if (type == "add") {
    let col = "";
    let val = "";
    Object.keys(args).map((key) => {
      col += ' "' + key + '" ,';
      val += "'" + args[key] + "' ,";
    });
    col = removeLastChar(col);
    val = removeLastChar(val);

    retstr = " ( " + col + " ) VALUES ( " + val + " )";
  }

  return retstr;
}

const resolvers = {
  Query: {
    getUsers: async (parent: any, args: any, context: any, info: any) => {
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
  },
  Mutation: {
    addUser: async (parent: any, { ...data }: any, context: any, info: any) => {
      const args = data.input;
      let retstr = processData(args, "add");
      const instRec = await psqlClient.queryObject(
        "insert into user_tbl " + retstr + "  returning *",
      );
      return instRec.rows;
    },
    editUser: async (
      parent: any,
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
  },
};

const GraphQLService = await applyGraphQL<Router>({
  path: "/graphql",
  Router,
  typeDefs: types,
  resolvers: resolvers,
  context: (ctx) => {
    return { user: "User" };
  },
});

const app = new Application();

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log("Server start at http://localhost:8080");
await app.listen({ port: 8080 });
