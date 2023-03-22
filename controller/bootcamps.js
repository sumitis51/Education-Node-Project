const asyncHandler = require("../middleware/async");
const Bootcamp=require("../models/Bootcamps");
const ErrorResponse=require("../utils/errorResponse");
const geocoder=require('../utils/geoCoder');

// @desc Get all bootcamps
// @access Public
exports.getBootcamps=asyncHandler(async(req,res,next)=>{
    let query;
    const reqQuery={...req.query}
    let queryStr=JSON.stringify(reqQuery);
    const removeFileds=["select","sort","page","limit"];

    removeFileds.forEach(params=>delete reqQuery[params]);

    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`)
    query=Bootcamp.find(JSON.parse(queryStr));

    // Select Fields
    if(req.query.select){
        const fields=req.query.select.split(",").join(" ");
        query=Bootcamp.select(fields);
    }

    // Sort Fields
    if(req.query.sort){
        const sortFileds=req.query.sort.split(",").join(" ");
        query=Bootcamp.select(sortFileds);
    }
// Pagination
    const page=parseInt(req.query.page,10) || 1;
    const limit=parseInt(req.query.limit,10) || 25;
    const startIndex=(page-1)*limit;
    const endIndex=page*limit;
    const total=await Bootcamp.countDocuments();
    query=query.skip(startIndex).limit(limit);
    // Excute Query
    const data=await query;

    // pagination Result
    const pagination={};
    if(endIndex<total){
        pagination.next={
            page:page+1,
            limit
        }
    }
    if(startIndex>0){
        pagination.prev={
            page:page-1,
            limit
        }
    }
        res.status(200).json({
            success:true,
            data,
            count:data.length,
            pagination
        })
});

// @desc Get single bootcamps
// @access Public
exports.getBootcamp=asyncHandler(async(req,res,next)=>{
        const data=await Bootcamp.findById(req.params.id);
        if(!data){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        res.status(200).json({ 
            success:true,
            data
        })
    })


// @desc Create new bootcamps
// @access Public
exports.createBootcamp=asyncHandler(async(req,res,next)=>{
        const bootcamp=await Bootcamp.create(req.body);
        res.status(201).json({
          success:true,
          data:bootcamp
        }) 
})


// @desc update bootcamps
// @access Public
exports.updateBootcamp=asyncHandler(async(req,res,next)=>{
        const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
         res.status(200).json({success:true,data:bootcamp});
})

// @desc delete bootcamps
// @access Public
exports.deleteBootcamp=asyncHandler(async(req,res,next)=>{
    const bootcamp=await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
         res.status(200).json({success:true,data:{}});
})

// @desc Get bootcamps within radius
// @access Public
exports.getBootcampsInRadius=asyncHandler(async(req,res,next)=>{
const {zipcode,distance}=req.params;

// Get lat/lang
    const loc=await geocoder.geocode(zipcode);
    const lat=loc[0].latitude;
    const lng=loc[0].longitude;
// Calc radius using radius
// Divide dist byh radius of Earth
// Earth Radius=3,963 mi/6,378  
const radius=distance/3963;
const bootcamps=await Bootcamp.find({
    location:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}
});
res.status(200).json({
    success:true,
    count:bootcamps.length,
    data:bootcamps
})
   })