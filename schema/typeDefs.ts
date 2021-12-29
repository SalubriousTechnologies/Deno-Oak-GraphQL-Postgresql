import { gql } from "../deps.ts";

// GraphQL types
export const typeDefs = gql`
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
    Users(id :ID, userName: String): [User] 
    
  }
  type Mutation{
    addUser(input: UserInput): [User]
  }
  `;
