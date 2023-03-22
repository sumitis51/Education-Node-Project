const asyncHandler = require("../middleware/async");
const Course=require("../models/Courses");
const ErrorResponse=require("../utils/errorResponse");

// @desc Get all courses
// @access Public
exports.getCourses=asyncHandler(async(req,res,next)=>{
    let query;
    if(req.params.bootcampId){
        query=Course.find({bootcamp:req.params.bootcampId})
    }else{
        query=Course.find()
    }
    const courses=await query;
    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
    })
})

// @desc Get Single course
// @access Public
exports.getCourse=asyncHandler(async(req,res,next)=>{
    const course=await Course.findById(req.params.id).populate({
        path:"bootcamp",
        select:"name description"
    });

    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req,params.id}`,404))
    }
    res.status(200).json({
        success:true,
        count:course.length,
        data:course
    })
})