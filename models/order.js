const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "books",
    },
    status: {
        type: String,
        default:"Order Placed",
        enum:["Order Placed","Out Of Delivered","Canceled"]
    },
    

},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('order',orderSchema);