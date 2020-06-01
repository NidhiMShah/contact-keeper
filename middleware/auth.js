const jwt =require('jsonwebtoken');
const config=require('config');


module.exports=function(req,res,next){
    //Get token from header
    const token=req.header('x-auth-token1');

    //check if not token
    if(!token){
        return res.status(400).json({msg: 'No token, authorization denied'})
    }

    try{
        const decoded=jwt.verify(token, config.get('jwtSecret'));

        req.user=decoded.user;
        next();
    }catch(err){
        res.status(401).json({msg: 'Token is not valid'});
    }

}

//To verify user, first login with email, password credentials---if valid--then give the token
//Now to verify the token---get-->localhost:5000/api/auth--->here in the headers--add key as "'x-auth-token", as name specified in line 7 
//Add value as the token recieved when login succesful..then we data of the usr, else auth denied