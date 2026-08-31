const mongoose = require("mongoose")

function connectDB(){
    mongoose.connect(process.env.DBURI)
        .then(()=>{
            console.log("Mongoose connected successfully");
        })
        .catch((error) => console.log(`error while connecting to Mongoose ${error}`))
}

module.exports = connectDB;