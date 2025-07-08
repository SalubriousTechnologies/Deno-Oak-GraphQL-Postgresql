**Deno+Postgresql+Graphql**

*Archiving note*: This repository is no longer being maintained and is being archived on
8-Jul-2025

`deno run --allow-net --unstable index.ts`：
 http://localhost:8080/graphql


**Query Insert request**
```
mutation{	
   addUser(input:{
     userName: "Vinay",
     email:"raman@gmail.com",
     country: "india",
     address:"Dih Ganjari Gangapur",
     contact:4554554,
     priority:HIGH
  }){
    id,
    userName
    email    
  }
}
```
**Query Fetch request**
```
query{ getUsers{   
     id,
     userName
     email     
  }
}



query{ getUsers(id:"53"){   
     id,
     userName
     email     
  }
}
