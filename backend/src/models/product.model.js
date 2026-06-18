import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        minLenhgth: [50, "Must be atleast 50 characters"],
        maxLength: [300,"Must be atmost 300 characters"],
        required: true
    },
    images: {
        type: [String],
        validate: {
            valdator: function (v) {
                return v && v.length > 0 
            }
        },
        message: "You must upload atleast one image"
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    cateory: {
        type: String,
        required: true
    },
    isFeaured: {
        type: Boolean,
        default: false
    }

},{timestamps: true})

const Product = mongoose.model ("Product", productSchema)

export default Product