const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const bcrypt = require('bcryptjs');

//components
const {authenticationToken} = require('./userAuth');
const User = require('../models/user');

//add books by admin
router.post('/add-book',authenticationToken,async(req,res)=>{
    try{
        //check this is admin or not
        const {id}=req.headers;
        const admin = await User.findById({_id:id});

        if(!admin){
            return res.status().json({message:"you can not add books because you are not admin"});
        }
        const {url,title,author,price,desc,language}=req.body;

        const book = new Book({
            url,
            title,
            author,
            price,
            desc,
            language
        })
        await book.save();
        res.status(200).json({
            message:"New Book Added Successfully",
            newBook:book
        })
    }catch(err){
        return res.status(500).json({
            error:err.message  ||  "Internal Server Error"
        })
    }
})



//update book
router.put('/update-book',authenticationToken,async(req,res)=>{
    try{
        const {bookid} = req.headers;
        console.log("bookid",bookid);
        const book = await Book.findByIdAndUpdate(bookid,{
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language
        })
        if(!book){
            return res.status(400).json({
                message:"Book not exist with this book id"
            })
        }
        return res.status(200).json({
            message:"Book Updated Successfully",
            book
        })
    }catch(err){
        return res.status(500).json({
            error:err.message  ||  "Internal Server Error"
        })
    }
})



//delete-book
router.delete('/delete-book',authenticationToken,async(req,res)=>{
    try{
        console.log("delete document")
        const {bookid} = req.headers;
        const book = await Book.findById(bookid)

        if(!book){
            return res.status(400).json({
                message:"Book not exist with this book id"
            })
        }
        await book.deleteOne();
        return res.status(200).json({
            message:"Book Delete Successfully",
        })
    }catch(err){
        return res.status(500).json({
            error:err.message  ||  "Internal Server Error"
        })
    }
})


//get all books
router.get('/get-all-books',async(req,res)=>{
    try{
 
        const books = await Book.find().sort({createdAt:-1});
        if(books.length==0){
            return res.status(200).json({message:"No books"})
        }

        return res.status(200).json({
            data:books
        })
    }catch(err){
        return res.status(500).json({
            error:err.message  ||  "Internal Server Error"
        })
    }
})



//get recent books
router.get('/get-recent-books',async(req,res)=>{
    try{
        //createdAt  used find the recent added books and limit used to get the limited books 
        const books = await Book.find().sort({createdAt:-1}).limit(4);
        if(books.length==0){
            return res.status(200).json({message:"No books"})
        }

        return res.status(200).json({
            data:books
        })
    }catch(err){
        return res.status(500).json({
            error:err.message  ||  "Internal Server Error"
        })
    }
})


//get book by Id
router.get('/get-book-by-id/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        const book = await Book.findById({_id:id});
        if(!book){
            return res.status(200).json({message:"No book"})
        }

        return res.status(200).json({
            data:book
        })
    }catch(err){
        return res.status(500).json({
            error:err.message  ||  "Internal Server Error"
        })
    }
})

module.exports = router;