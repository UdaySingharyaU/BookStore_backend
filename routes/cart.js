const express = require('express');
const router = express.Router();
const Book = require('../models/book');

//components
const {authenticationToken} = require('./userAuth');
const User = require('../models/user');

//routes
router.put('/add-to-cart',authenticationToken,async(req,res)=>{
    try{
        const {bookid,id}=req.headers;
        const userData = await User.findById(id);
        if(!userData){
            return res.status(404).json({message:"User not found"})
        }
        const isBookInCart = userData.cart.includes(bookid);
        console.log("isboo",isBookInCart)
        if(isBookInCart){
            return res.status(200).json({
                message:"book already added to Cart"
            })
        }
        await User.findByIdAndUpdate(id,{$push:{cart:bookid}});
        return res.status(200).json({message:"Book added to cart"});
    }catch(err){
        res.status(500).json({message:"Internal Server Error "});
    }
})



//delete-book in the favourite
router.put('/remove-book-from-cart/:bookid',authenticationToken,async(req,res)=>{
    try{
 
        const {bookid} = req.params;
        const {id} = req.headers;

        await User.findByIdAndUpdate(id,{$pull:{cart:bookid}});
        return res.json({
            status:"Success",
            message:"Book remooved from  cart"
        })
    }catch(err){
        return res.status(500).json({
            error:err.message  ||  "Internal Server Error"
        })
    }
})


// //get favourite book of a particular User
router.get('/get-user-cart',authenticationToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const userData = await User.findById(id).populate("cart");
        console.log("userData",userData);
        const data = userData.cart.reverse();
        return res.json({
            status:'success',
            data
        }) 
    }catch(err){
        return res.status(500).json({
            error:err.message  ||  "Internal Server Error"
        })
    }
})


module.exports=router;