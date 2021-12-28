import { psqlClient } from '../psql-connect.ts';
export const Mutation = {
    addUser:  async (parent: any,{...data}:any, context: any, info: any) => {
        const instRec = await psqlClient.queryObject("insert into user_tbl (\"userName\", \"country\", \"email\", \"contact\", \"address\",\"priority\") values ('"+data.input.userName+"','"+data.input.country+"','"+data.input.email+"','"+data.input.contact+"','"+data.input.address+"','"+data.input.priority+"')  returning *");
        return instRec.rows;
        //console.log(instRec);
        //await psqlClient.queryObject
    }

};