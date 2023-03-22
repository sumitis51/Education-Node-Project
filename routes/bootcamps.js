const express=require("express");
const { getBootcamps,createBootcamp,deleteBootcamp,getBootcamp,getBootcampsInRadius,updateBootcamp} = require("../controller/bootcamps");

const router=express.Router();

router.route('/').get(getBootcamps).post(createBootcamp);

router.route('/:id').put(updateBootcamp).delete(deleteBootcamp).get(getBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

module.exports=router; 