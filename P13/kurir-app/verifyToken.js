const jwt = require('jsonwebtoken');
const SECRET_KEY = "kurir-secret-key";

function verifyToken(req,res,next){
    
    const bearerHeader = req.headers['authorization'];

    if(!bearerHeader)
        return res.status(403).json({message:"Token diperlukan"});

    const token = bearerHeader.split(" ")[1];

    jwt.verify(token,SECRET_KEY,(err,decoded)=>{
        if(err)
            return res.status(401).json({message:"Token tidak valid"});

        req.user = decoded;
        next();
    });
}

module.exports = verifyToken;