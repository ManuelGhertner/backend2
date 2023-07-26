import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = "users";

const schema = new mongoose.Schema({
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true },
    password: { type: String },
    // cart: { 
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "carts"
    // },
    role: { type: String, trim: true, default: "user", enum: ["user", "admin"] }
});

const userModel = mongoose.model(collection, schema);

export default userModel;
