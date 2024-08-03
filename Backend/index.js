const express = require('express')
const mongoose =  require("mongoose")
const bodyParser = require("body-parser")
const RouterUser = require("./router/user")
const RouterAdmin = require("./router/admin")
const app = express()
const path = require("path")
const {Car} = require("./database/db")

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../Frontend')))
mongoose.connect("mongodb+srv://QuadiroTechnologies:hzPiE0zZ5PhkLgYd@cluster0.9t6cnir.mongodb.net/QuadiroTechnologies")



app.use("/admin", RouterAdmin)
app.use("/user", RouterUser)

app.get('/user/cars', (req, res) => {
    console.log('Received request for /user/cars');
    res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
})

app.get('/api/user/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.listen(3000, () =>{
    console.log("Okk!")
})

