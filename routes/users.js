const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');

const User = require('../models/User');

// @route      POST api/users
// @desc       Register a user
// @access     Public
router.post('/', [
    //checking for not empty
    check('name', 'Please enter Name').not().isEmpty(),
    check('email','Please enter include a valid email').isEmail(),
    check('password','Please enter a passsword with6 or more characters').isLength({min: 6})
],
 async (req,res)=>{
    //res.send('Register a user');
    //To access req.body we need to add middleware in server.js....
    //previously body-parser was used now express has inbuilt
   // res.send(req.body);
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
   // res.send('Passed') 

   const {name,email,password}=req.body;

   try{
       let user= await User.findOne({email});

       if(user){
           return res.status(400).json({msg: 'User already exists'});
       }
       user= new User({name,email,password});

       //encrpyt 
       const salt = await bcrypt.genSalt(10);

       user.password=await bcrypt.hash(password,salt);

       await user.save();

      // res.send('User Saved');
      const payload={
          user:{
              id: user.id
          }
      }

      //togenerate token
      jwt.sign(payload, config.get('jwtSecret'),{
          expiresIn: 36000
      },(err,token)=>{
          if(err) throw err;
          res.json({token})
      })

   } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
   }
});

module.exports=router;