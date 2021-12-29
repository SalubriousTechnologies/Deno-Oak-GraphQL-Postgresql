import { psqlClient } from "../db/psql-connect.ts";
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
