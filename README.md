deno+postgresql+graphql



`deno run --allow-net --unstable index.ts`：
 http://localhost:8080/graphql


Query

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
