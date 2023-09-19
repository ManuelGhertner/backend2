import mongoose from "mongoose";

mongoose.pluralize(null);
const collection = "carts";

const schemaOptions = {
    versionKey: false
};

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number,
                _id: false,
            },
        ],
        default: [],
    },
    email: {
        type: String,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, schemaOptions);

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;