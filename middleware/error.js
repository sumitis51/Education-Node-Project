const ErrorResponse = require("../utils/errorResponse");

function errorHandler (err, req, res, next) {
   let error={...err}

   error.message=err.message;

  // Mongoose bad ObjectId
   if(err.name==="CastError"){
    const message=`Bootcamp not found with id of ${err.value}`;
    error=new ErrorResponse(message,404)
   }
  // Mongoose duplicate key
  if(err.code===11000){
  const message='Duplicate filed value entered';
  error=new ErrorResponse(message,400)
  }
  //Mongoose Validation Error
  if(err.name==="ValidationError"){
  const message=Object.values(err.errors).map(val=>val.message);
  error=new ErrorResponse(message,400);
  }
    res.status(error.statusCode || 500).json({
      success:false,
      error:error.message || "Server Error"});
  }
 
  module.exports=errorHandler;