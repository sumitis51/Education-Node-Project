const mongoose = require('mongoose');
const slugify=require("slugify");
const geocoder=require("../utils/geoCoder");

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true,
        unique: true,
        maxlenght: [50, 'Name cannot be more than 50 char']
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlenght: [500, 'Description cannot be more than 500 char']
    },
    website: {
        type: String
    },
    email: {
        type: String,
        match: [
            /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
            "Please use a valid URL with HTTP or HTTPS"
        ]
    },
    address: {
        type: String,
        required: [true, "Please add an address"]
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    carrers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be atleast 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGit: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})


// Create bootcamp slug from Name
BootcampSchema.pre("save",function(next){
   this.slug=slugify(this.name,{lower:true})
    next();
})

// GeoCode and Create Location field
BootcampSchema.pre("save",async function(next){
const loc=await geocoder.geocode(this.address);
this.location={
    type:"Point",
    coordinates:[loc[0].longitude,loc[0].latitude],
formattedAddress:loc[0].formattedAddress,
street:loc[0].streetName,
city:loc[0].city,
state:loc[0].stateCode,
zipcode:loc[0].zipcode,
country:loc[0].countryCode
}
this.address=undefined;
    next();
})


// Reverse populate with virtuals
BootcampSchema.virtual("coursed",{
ref:"Course",
localField:"_id",
foreignField:"bootcamp",
justOne:false
})

module.exports = mongoose.model("Bootcamp", BootcampSchema);