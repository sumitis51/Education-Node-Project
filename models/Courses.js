const mongoose=require("mongoose");

const CourseSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,"Please add a course title"]
    },
    description:{
        type:String,
        required:[true,"Please add a description"]
    },
    weeks:{
        type:String,
        required:[true,"Please add a number of weeks"]
    },
    tuition:{
        type:Number,
        required:[true,"Please add a tuition cost"]
    },
    miniumSkill:{
        type:String,
        required:[true,"Please add a minium skill"],
        enum:["beginner",'intermediate,"advanced']
    },
    scholarshipAvailable:{
        type:String,
        default:false
    },
    createdAt:{
        type:Date,
       default:Date.now
    },
    bootcamp:{
        type:mongoose.Schema.objectId,
        ref:"Bootcamp",
        required:true
    }
})

module.exports=mongoose.model("Course",CourseSchema);