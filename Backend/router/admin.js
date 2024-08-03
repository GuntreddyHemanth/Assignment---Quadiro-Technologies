const express = require("express");
const { Admin, Car} = require("../database/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const JWT_SECRET = require("../config")
const middlewareByAdmin = require("../middlewares/admin")


//Admin registration

router.post("/registration", async (req, res) => {
    const {username, password} = req.body
    let admin = await Admin.findOne({username})
    if (admin) {
        res.status(400).json({
            message: "Admin already exists"
        })
    }
    const hashing = await bcrypt.hash(password, 10)
    await Admin.create({
        username,
        password:hashing
    })
    res.json({
        message: "Admin created successfully"
    })
})

// Admin login 

router.post("/login", async (req, res) => {
    const {username, password} = req.body 
    const admin = await Admin.findOne({username})
    if (!admin) {
        return res.status(400).json({
            message:"Invalid Username"
        })
    }

    try {
        const validPassword = await bcrypt.compare(password, admin.password)
        if (!validPassword) {
            return res.status(400).json({
                message:"Invalid password"
            })
        } 
        const token = jwt.sign({
            username}, JWT_SECRET)
        res.json({
            token
        })
    } catch (error) {
        console.log("error message :", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }

})

//CRUD OPERATIONS : Create, Read, Update, Delete 

//Create new Car in Database
router.post("/cars", middlewareByAdmin, async (req, res) => {
    const {carname, manufacturingYear, price} = req.body
    try {
        await Car.create({
            carname,
            manufacturingYear,
            price
        })
        res.json({
            message:"Car created successfully"
        })
    } catch (error) {
        res.json({
            message:"Invalid Inputs"
        })
    }
})

//Read from Database
router.get("/cars", middlewareByAdmin, async (req, res) => {
    const cars = await Car.find();
    res.send(cars)
})

//Update to Database
router.put("/cars/:id", middlewareByAdmin, async (req, res) => {
    const getId = req.params.id
    const {carname, manufacturingYear, price} = req.body
    const carUpdate = await Car.findByIdAndUpdate(getId, {carname, manufacturingYear, price})
    res.send(carUpdate)
})

//Delete from Database
router.delete("/cars/:id", middlewareByAdmin, async (req, res) => {
    try {
        const getId = req.params.id 
        await Car.findByIdAndDelete(getId)
        res.json({
            message: "car deleted"
        })
        
    } catch (error) {
        res.status(404).json({
            message: "car not found"
        })   
    }
})


module.exports = router
