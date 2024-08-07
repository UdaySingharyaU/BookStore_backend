const jwt = require('jsonwebtoken');

const authenticationToken= async(req,res,next)=>{
    const authHeader  = req.headers["authorization"];
    const token = authHeader  && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Authorization token required"});
    }

    jwt.verify(token,process.env.SECRET_KEY,(err,payload)=>{
        if(err){
            return res.status(403).json({message:"Token Expires ,Please SignIn Again"});
        }

        req.user=payload;
        next();
    });
};

module.exports = {authenticationToken}