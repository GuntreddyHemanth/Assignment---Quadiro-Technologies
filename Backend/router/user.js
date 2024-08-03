const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Car } = require("../database/db");
const JWT_SECRET = require('../config');

// Define user routes here

//registration router
router.post("/registration", async (req, res) => {
    const {username, password} = req.body 
    let user = await User.findOne({username})
    if (user) {
        res.status(400).json({
            message:"user already exists"
        })
    }
    const hashing = await bcrypt.hash(password, 10)
    await User.create({
        username,
        password: hashing 
    })
    res.json({
        messsage: "User registred successfully"
    })
})

//login router

router.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body 
        const user = await User.findOne({username})
        if (!user) {
            return res.status(403).json({
                message: "Invalid User"
            })
        }
        const passwordCheck = await bcrypt.compare(password, user.password)
        if (!passwordCheck) {
            return res.status(403).json({
                message: "Invalid Password"
            })
        }
        const token = jwt.sign({
            username
        }, JWT_SECRET)

        res.json({
            token
    })
  } catch (error) {
        console.log(error)
        res.status(400).json({
            message:"Server Error"
        })
    }
})

// view all cars that are created by Admin 
router.get("/cars", async (req, res) => {
    const totalcars = await Car.find()
    res.json(totalcars)
})

// you can view in http://localhost:3000/index.html


module.exports = router;
