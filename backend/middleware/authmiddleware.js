const jwt = require("jsonwebtoken")

const authmiddleware = (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader) return res.status(401).json({ success:true,message:"Authorization token Missing", })
        const token = authHeader.split(" ")[1];
        if(!token) return res.status(401).json({success:false,message:"Token missing"});

        const decode = jwt.verify(token,process.env.JWT_SECRATE);
        req.user = decode;
        next();
    }catch(error){
        console.log(`error while login user ${error}` );
        return res.status(401).json({success:false,message:"Invalid or expire token",})
    }
}

module.exports = authmiddleware;