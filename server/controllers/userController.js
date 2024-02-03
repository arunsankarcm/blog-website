const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');



exports.signUp = [
    body('username').isLength({ min: 5 }).trim().escape(),
    body('password').isLength({ min: 6 }),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: hashedPassword });
            await newUser.save();
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
];

exports.userLogin = async(req,res) => {
    const { username, password } = req.body;
try{
    const user = await User.findOne({username,password});
    if(!user){
        return res.status(401).json({message:'Invalid credentials'});
    }

    const token = jwt.sign({ userId: user._id, admin: user.admin }, process.env.JWT_SECRET);
    res.json({
        token: token,
        isAdmin: user.admin 
    });
}catch(error) {
    res.status(500).json({message:'Server Error'});
}
};



