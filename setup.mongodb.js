const mongoose = require('mongoose')
const mongoURL = 'mongodb+srv://<username>:<password>@cluster0.ntvqvow.mongodb.net/newDB'

const connectDB = async()=>{
    try{
        await mongoose.connect(mongoURL)
        console.log("Connection Successful")
        console.log("Working in",  mongoose.connection.name)
    }
    catch(error){
        console.error("Error connecting to the Database");
        process.exit(1);
    }
}
module.exports = connectDB