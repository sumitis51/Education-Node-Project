const fs=require("fs");
const mongoose=require("mongoose");
const dotenv=require("dotenv");

dotenv.config({path:"./config/config.env"});
const URI=process.env.URI;
// Load models
const Bootcamp=require("./models/Bootcamps");

// Connect to DB
mongoose.connect(URI,{
    useNewUrlParser:true
   });

// Read JSON files
const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamp.json`,"utf-8"));

// Import into DB

const importData=async()=>{
    try{
    await Bootcamp.create(bootcamps)
    process.exit()
    }catch(err){
    console.log(err)
    }
{}}

// Delete data
const deleteData=async()=>{
    try{
    await Bootcamp.deleteMany()
    process.exit()
    }catch(err){
    console.log(err)
    }
{}}

if(process.argv[2]==='-i'){
    importData();
}else if(process.argv[2]==='-d'){
    deleteData();
}
