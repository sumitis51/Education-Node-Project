const jwt=require("jsonwebtoken");

const asyncHandler=require("./async");

const ErrorResponse=require("../utils/errorResponse");

const User=require("../models/User");

// Protect route
exports.protect=asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startWith("Bearer")){
        token=req.headers.authorization.split(" ")[1];
    }
    // else if(req.cookies.token){
    //     token=req.cookies.token;
    // }
    // Make sure token exists
    if(!token){
        return next(new ErrorResponse("Not authorize to access this route",401))
    }
    try {
        // verify token
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findById(decoded.id);
        next();
    } catch (error) {
        
    }
})