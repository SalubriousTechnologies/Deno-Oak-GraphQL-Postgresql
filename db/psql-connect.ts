import { Client } from "../deps.ts";

const client = {
  user: "pathuser",
  password: "pass123",
  database: "path_basti",
  hostname: "localhost",
  port: 5432,
};
//const ft = await client.connect();

const psqlClient = new Client(client);

export { psqlClient };
