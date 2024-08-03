const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
})

const userSchema = new mongoose.Schema({
    username: String,
    password: String 
})

const carSchema = new mongoose.Schema({
    carname: String,
    manufacturingYear: Number,
    price: Number
})


const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Car = mongoose.model("Car", carSchema);

module.exports = {
    Admin,
    User,
    Car
}