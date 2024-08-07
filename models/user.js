const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/3177/3177400.png",
    },
    role: {
        type: String,
        default: "admin",
        enum: ["user", "admin"]
    },
    favourites: [{
        type: mongoose.Types.ObjectId,
        ref: "books",
    }],
    cart: [{
        type: mongoose.Types.ObjectId,
        ref: "books",
    }],
    orders: [{
        type: mongoose.Types.ObjectId,
        ref: "order",
    }],
}, {
    timestamps: true,
});

// Method to generate verification token
userSchema.methods.generateVerificationToken = function() {
    const payload = {
        name: this.username,
        role: this.role,
        // userId: this._id,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });
    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
