import { RouterContext } from "../dependencies/oak-deps.ts";
import { queryPsqlResults } from '../psql-query.ts';
const querySql = 'select * from user_tbl;';
const Query = {

    getUsers: async (parent: any,args: any, context: any, info: any) => {
      
        if(Object.keys(args).length === 0 && args.constructor === Object){
          return await queryPsqlResults(querySql);
        }else{
           let where = ' WHERE ';
           Object.keys(args).map((key) => where+=' "'+key +'"'+"='"+args[key]+"' AND" );
           
           let res = where.split(" ");  //split by space
            res.pop();  //remove last element
            let retstr = res.join(" ");
            console.log("select * from user_tbl "+retstr+";");
          return await queryPsqlResults("select * from user_tbl "+retstr+";");
          //console.log(args['id']);
        }
        
    },
    Users: async (parent: any,args: any, context: any, info: any) => {
      
        if(Object.keys(args).length === 0 && args.constructor === Object){
          return await queryPsqlResults(querySql);
        }else{
           let where = ' WHERE ';
           Object.keys(args).map((key) => where+=' "'+key +'"'+"='"+args[key]+"' AND" );
           
           let res = where.split(" ");  //split by space
            res.pop();  //remove last element
            let retstr = res.join(" ");
            console.log("select * from user_tbl "+retstr+";");
          return await queryPsqlResults("select * from user_tbl "+retstr+";");
          //console.log(args['id']);
        }
        
    }
}



export {
    Query
}