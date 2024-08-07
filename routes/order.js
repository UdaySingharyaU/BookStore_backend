const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Order = require('../models/order');
//components
const { authenticationToken } = require('./userAuth');
const User = require('../models/user');


//router
router.post('/place-order', authenticationToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;

        // Validate input
        if (!id || !order || !Array.isArray(order)) {
            return res.status(400).json({
                error: "Invalid request. Ensure id and order are provided correctly."
            });
        }

        // Fetch user
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                error: "User not found."
            });
        }

        // Process each order item
        for (const orderData of order) {
            console.log("order=======", order);
            const newOrder = new Order({
                user: user._id,
                book: orderData
            });
            console.log("new Order=======", newOrder);
            await newOrder.save();

            // Update user
            user.orders.push(newOrder._id);
            user.cart.pull(orderData);
            await user.save();
        }
        console.log(user)
        return res.json({
            status: "Success",
            message: "Order placed successfully."
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message || "Internal Server Error"
        });
    }
})


//get order history
router.get('/get-order-history', authenticationToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        })
        console.log(userData)
        const ordersData = userData.orders.reverse();
        return res.json({
            data: ordersData
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message || "Internal Server Error"
        })
    }
})


//get all order admin
router.get('/get-all-orders', authenticationToken, async (req, res) => {
    try {
        const userData = await Order.find()
            .populate("book")
            .populate("user")
            .sort({ createdAt: -1 });
        return res.json({
            status: "Success",
            data: userData
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message || "Internal Server Error"
        })
    }
})



//update oredr adimn
router.put('/update-status/:id', authenticationToken, async (req, res) => {
    try {
        const userId = req.headers.id;
        const { id } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not exist with this Id" });
        }
        if (user.role === "user") {
            return res.json({ message: "User can not update Status of order" })
        }
        const order = await Order.findByIdAndUpdate(id, { status: req.body.status });
        if (!order) {
            return res.status(400).json({
                message: "Order not exist with this Id"
            })
        }
        return res.json({
            status: "Success",
            message: "Status updated Successfully"
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message || "Internal Server Error"
        })
    }
})
module.exports = router;