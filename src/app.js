const e = require("express");
const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  //creating a new instance of the User model
  const user = new User(req.body);
  try {
    //validate req.body
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User saved successfully!");
  } catch (e) {
    res.status(404).send("Error:" + e.message);
  }
});

app.post("/login", async(req,res)=>{

  try {
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId:emailId});
    if(!user){
      throw new Error("Invalid Credentials")
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(isPasswordValid){
      res.send("Login successful!");
    }
    else{
      res.send("Invalid Credentials!");
    }
  } catch (error) {
    res.status(400).send("ERROR: "+error.message);
  }
})

app.get("/user", async (req, res) => {
  const userEmailId = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmailId });
    if (user.length > 0) res.send(user);
    else {
      res.send("user doesn't exist with this email id");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length) res.send(users);
    else {
      res.send("no user in the DB!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    const data = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully!" + data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.patch("/update/:userId", async (req, res) => {
  const data = req.body;
  const userId = req.params.userId;
  try {
    const ALLOWED_UPDATES = [
      "skills",
      "age",
      "photoUrl",
      "about",
      "gender",
      "firstName",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("update not allowed!");
    }
    if (data?.skills.length > 10)
      throw new Error("skills can't be more than 10!");
    const updatedData = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("user data update successfully! " + updatedData);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB connection established!");
    app.listen(3000, () => {
      console.log("server is running at  " + 3000 + " successfully!");
    });
  })
  .catch((e) => {
    console.error("DB connection failed!");
  });
