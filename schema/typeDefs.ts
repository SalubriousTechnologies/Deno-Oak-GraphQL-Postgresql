import { gql } from "../deps.ts";

// GraphQL types
export const types = gql`

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
