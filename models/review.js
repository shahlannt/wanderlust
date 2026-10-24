const mongoose=require('mongoose');
const User = require('./user');

const schema= mongoose.Schema;

const reviewSchema = new schema({
    comment: {
        type: String
        },
    rating: {
        type: Number,
        min: 1,
        max: 5
        },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User, 
    }
    
});

const review = mongoose.model('review', reviewSchema);
module.exports = review;