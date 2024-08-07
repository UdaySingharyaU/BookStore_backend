const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

//components
const {authenticationToken} = require('./userAuth');




//sign Up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;
        console.log(username, email, password, address);
        if (username.length < 4) {
            return res.status(400).json({ message: "Username length should be greater that 3" });
        }

        const hasPassword = await bcrypt.hash(password, 10);
        const existusername = await User.findOne({ username: username });
        if (existusername) {
            return res.status(400).json({ message: "Username already exist" });
        }
        const exitEmail = await User.findOne({ email: email });
        if (exitEmail) {
            return res.status(400).json({ message: "Email already exist" });
        }

        if (password.length <= 5) {
            return res.status(400).json({ message: "Password length should be greater than equal to 6" });
        }

        const newUser = new User({
            username,
            email,
            password: hasPassword,
            address,
        })
        await newUser.save();
        res.status(200).json({
            message:"SignUp SuccessFull",
            newUser: newUser
        })
    } catch (err) {
        return res.status(500 || err.status).json({ error: err || "Internal Server error" })
    }
})


//for login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existUser = await User.findOne({ username: username });

        if (!existUser) {
            return res.status(400).json({
                message: "User does not Exist"
            })
        }

        const isMatch = await bcrypt.compare(password, existUser.password);
        console.log("isMatch", isMatch);
        if (isMatch) {
            console.log("start");
            //generate verification Token
            const token = existUser.generateVerificationToken();
            console.log("token get");
            return res.status(200).json({
                message: "Login Successfully",
                data: {
                    _id: existUser._id,
                    username: existUser.username,
                    email: existUser.email,
                    role: existUser.role,
                    token
                }
            })
        } else {
            return res.status(400).json({
                message: "Invalid Creadiantials",
            })
        }
    } catch (err) {
        res.status(err.status || 500).json({
            error: err.message || "Internal Server Error"
        })
    }
})


//for get-user-information
router.get('/get-user-information', authenticationToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const userInfo = await User.findById({_id:id}).select("-password");
    
        if(!userInfo){
            return res.status(400).json({
                message:"user does not exist with this Id "
            })
        }
        return res.status(200).json(userInfo)
    } catch (err) {
        return res.status(500).json({
            error:err.message  ||  "Internal Server Error"
        })
    }
})


//UUpdate user address
router.put('/update-address', authenticationToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const {address} = req.body;
        const userInfo = await User.findByIdAndUpdate({_id:id},{address:address});
    
        if(!userInfo){
            return res.status(400).json({
                message:"user does not exist with this Id "
            })
        }
        return res.status(200).json({message:"Address Updated succesfully"})
    } catch (err) {
        return res.status(500).json({
            error:err.message  ||  "Internal Server Error"
        })
    }
})






module.exports = router;