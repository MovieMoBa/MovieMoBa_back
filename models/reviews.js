const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    movieID: {type: String, required: true},
    comment: String,
    rating: {type: Number, min:0, max:10},
    createdAt: {type: Date, default: Date.now}
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review