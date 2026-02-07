const express = require("express");
const app = express();
const { default: mongoose } = require("mongoose");
const connectDB =  require("./setup.mongodb")
const port = '3000'

connectDB();

const userSchema = new mongoose.Schema({
  name: String,
  status: {
    type: Boolean,
    default: false,
  },
});
const mongoDB = mongoose.model(`mongoDB`, userSchema, "express");

app.use(express.json())
app.get("/users", async(req, res)=>{
    const users = await mongoDB.find()
    result = res.json({users})
    console.log(users)
}) 

app.post("/users", async (req, res) => {
  try {
    const { name, status } = req.body;

    const user = await mongoDB.create({ name, status });

    res.status(201).json({
      message: "User created successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/users/delete/:id", async (req, res) => {
   
    const { id } = req.params;
    const user = await mongoDB.findByIdAndDelete(id);
    console.log("Deleted")
    res.json({ message: "User deleted successfully", user });
});

app.put("/users/update/:id", async (req, res) => {
    const { id } = req.params;
    const updateUser = await mongoDB.findByIdAndUpdate(id, req.body)

  res.json({message: "Updated successfully"})
});



app.listen(port)