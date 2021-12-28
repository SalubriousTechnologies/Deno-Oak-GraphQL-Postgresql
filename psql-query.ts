import {psqlClient} from './psql-connect.ts';

const queryPsqlResults = async (querySql: string)=>{  
  console.warn('start to query psql tables');
  const results = await psqlClient.queryObject(querySql);
  
  //console.log(results.rows);
  return results.rows;
}

export {
  queryPsqlResults,

}

