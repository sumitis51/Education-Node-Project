const express = require("express");
const { config }=require("dotenv");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
config({path:'./config/config.env'});
const connectDb=require("./config/db");
const errorHandler=require("./middleware/error");
const cookiedParser=require("cookies-parser");
const app=express();

// body parser
app.use(express.json())


app.use(cookiedParser)
// database connection
connectDb();

// routers
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);

app.use(errorHandler);

const PORT=process.env.PORT || 5000;

const server=app.listen(PORT,()=>console.log(`Running on ${PORT} ${process.env.NODE_ENV}`))

// Handle unhandle promise rejection

process.on("unhandleRejection",(err,promise)=>{
    console.log(`Error:${err.message}`);
// Close server 
server.close(()=>process.exit(1));
})