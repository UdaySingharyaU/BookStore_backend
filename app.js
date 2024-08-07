const express = require("express");
const app = express();

require("dotenv").config();
require('./conn/conn');

//use of cors for integration of backend and frontend
const cors = require('cors');

//components
const user = require('./routes/user');
const book = require('./routes/book');
const favourite = require('./routes/favourite');
const cart = require('./routes/cart');
const order = require('./routes/order');

//it saying jis language me data aa rha h 
app.use(express.json());

//use of cors
app.use(cors());

// routes
app.use("/api/v1",user);
app.use("/api/v1",book);
app.use("/api/v1",favourite);
app.use("/api/v1",cart);
app.use("/api/v1",order);

//Createing Port
app.listen(1000,()=>{
    console.log(`Server Started at ${process.env.PORT}`);
})