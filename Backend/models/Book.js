import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    alternateTitle: {
        type: String,
        default: ""
    },
    author: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: ""
    },
    publisher: {
        type: String,
        default: ""
    },
    bookCountAvailable: {
        type: Number,
        required: true
    },
    bookStatus: {
        type: String,
        default: "Available"
    },
    categories: { type: [String], default: [] }, 
    transactions: [{
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction"
    }]
}, 
{
    timestamps: true
});

// Check if the model already exists to prevent OverwriteModelError
export default mongoose.models.Book || mongoose.model("Book", BookSchema);
