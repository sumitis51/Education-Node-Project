const mongoose=require("mongoose");

const URI=process.env.URI;

const connectDb=async()=>{
   const conn=await mongoose.connect(URI,{
    useNewUrlParser:true
   });
   console.log(`Mongodb connected ${conn.connection.host}`)
}

module.exports=connectDb;