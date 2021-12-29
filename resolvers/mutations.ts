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
