const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

//to access protected/private route use middleware
const auth = require('../middleware/auth')

// @route      GET api/auth
// @desc       Get logged in user
// @access     Private-------middlewarerequired
router.get('/', auth, async (req, res) => {
    // res.send('Get logged in user');
    try {
        const user = await  User.findById(req.user.id).select('-password');
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error'); 
    }

});

// @route      POST api/auth
// @desc       Auth user & get token
// @access     Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
],
    async (req, res) => {
        //res.send('Log in user');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        // res.send('Passed') 

        const { email, password } = req.body;

        try {
            //checkemail
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            //check passsword
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            //togenerate token
            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 36000
            }, (err, token) => {
                if (err) throw err;
                res.json({ token })
            })

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

module.exports = router;