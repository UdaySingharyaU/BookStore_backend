const express = require('express');
const router = express.Router();
const Book = require('../models/book');

//components
const {authenticationToken} = require('./userAuth');
const User = require('../models/user');

//routes
router.put('/add-book-to-favourite',authenticationToken,async(req,res)=>{
    try{
        const {bookid,id}=req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            return res.status(200).json({
                message:"book already added to favourite"
            })
        }
        await User.findByIdAndUpdate(id,{$push:{favourites:bookid}});
        return res.status(200).json({message:"Book added to favourite"});
    }catch(err){
        res.status(500).json({message:"Internal Server Error "});
    }
})



//delete-book in the favourite
router.put('/remove-book-from-favourite',authenticationToken,async(req,res)=>{
    try{
 
        const {bookid,id} = req.headers;
        const userData = await User.findById({_id:id})
        const isBookFavourite = await userData.favourites.includes(bookid);
        if(isBookFavourite){
           await User.findByIdAndUpdate(id,{$pull:{favourites:bookid}});  
        }
        return res.status(200).json({
            message:"Book romoved from favourite",
        })
    }catch(err){
        return res.status(500).json({
            error:err.message  ||  "Internal Server Error"
        })
    }
})


//get favourite book of a particular User
router.get('/get-favourite-books',authenticationToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const userData = await User.findById(id).populate("favourites");
        const favouriteBooks = userData.favourites;
        return res.json({
            status:'success',
            data:favouriteBooks
        }) 
    }catch(err){
        return res.status(500).json({
            error:err.message  ||  "Internal Server Error"
        })
    }
})


module.exports=router;