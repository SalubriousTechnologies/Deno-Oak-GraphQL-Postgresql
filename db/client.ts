import { Client } from "../deps.ts";

const client = {
  user: "pathuser",
  password: "pass123",
  database: "path_basti",
  hostname: "localhost",
  port: 5432,
};

export const psqlClient = new Client(client);
