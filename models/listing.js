const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const { required } = require('joi');

const schema= mongoose.Schema;

const listingSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
            filename: {
                type: String,
                default: "listingimage"
            },
            url: {
                type: String,
                default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJhdmVsJTIwc2NlbmVyeXxlbnwwfHwwfHw%3D&w=1000&q=80",
                set: (v)=> v==="" ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJhdmVsJTIwc2NlbmVyeXxlbnwwfHwwfHw%3D&w=1000&q=80" : v,
            }
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,   
            ref: 'review',
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User.modelName,
    },
    geometry :{
         type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
            },
        coordinates: {
            type: [Number],
            required: true
            }
    },
    category: {
        type: String,
        enum: ['trending','iconic cities','hotels','Rooms','Homestays','Castles','Pools','Camps','Farms','arctic','Beach villas','Desert nights','Hill stays'],
        required: true,
    }
});

listingSchema.post('findOneAndDelete', async (listing)=> {
    if(listing){
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        })
    }
});


const listing = mongoose.model('listing', listingSchema);
module.exports = listing;