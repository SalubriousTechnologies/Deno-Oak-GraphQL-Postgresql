import {psqlClient} from './psql-connect.ts';

const closePsqlConnection = async ()=> {
  console.warn('start to close mysql connection');
  await psqlClient.end();
  console.warn('success to close mysql connection');
}

export {
  closePsqlConnection,
  
}