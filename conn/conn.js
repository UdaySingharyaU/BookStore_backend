const mongoose = require('mongoose');


const conn = async()=>{
    try{
        await mongoose.connect(process.env.URI);
    }catch(err){
        console.log("err",err);
    }
}

conn();