const express = require("express");
const app = express();
const { default: mongoose } = require("mongoose");
const connectDB =  require("./setup.mongodb")
const port = '3000'
const z = require("zod")
connectDB();

const userSchema = new mongoose.Schema({
  name: String,
  status: {
    type: Boolean,
    default: false,
  },
});
const mongoDB = mongoose.model(`mongoDB`, userSchema, "express");

const validationCreate = z.object({
  name :z.string(),
  status : z.boolean()
})
const validationUpdate = validationCreate.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);

app.use(express.json())
app.get("/users", async(req, res)=>{
    const users = await mongoDB.find()
    result = res.json({users})
    console.log(users)
}) 

app.post("/users", async (req, res) => {
  try {
    const result = validationCreate.safeParse(req.body);
    if(!result.success){
      return res.status(400).json({
        message : 'Error: validation failed, schema not followed'
      })
    }
    const user = await mongoDB.create( result.data );

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
    const result = validationUpdate.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Error: validation failed, schema not followed",
      });
    }
    const updateUser = await mongoDB.findByIdAndUpdate(id, result.data)

  res.json({message: "Updated successfully"})
});



app.listen(port)