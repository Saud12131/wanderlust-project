const { string, date } = require("joi");
const mongoose  = require("mongoose");
const schema = mongoose.Schema;

const ReviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author:{
    type: schema.Types.ObjectId,
    ref:"User"
    }
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = mongoose.model("Review",ReviewSchema);