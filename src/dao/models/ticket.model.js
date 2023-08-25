import mongoose from "mongoose";

mongoose.pluralize(null);
const collection = "tickets";

const ticketSchema = new mongoose.Schema ({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, default: Date.now, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
});


const ticketModel = mongoose.model(collection, ticketSchema);

export default ticketModel;