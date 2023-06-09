const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const campgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String, 
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// This middleware is called whenever findOneAndDelete is called on the campgroundSchema
// doc is the document that was deleted and is passed into the function
// $in operator says to get anything within the array passed in
campgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);