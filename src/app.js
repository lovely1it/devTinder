const e = require("express");
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  //creating a new instance of the User model
  const user = new User(req.body);
  try {
    const data = await user.save();
    console.log(data);
    res.send("User saved successfully!");
  } catch (e) {
    res.status(404).send("Error saving user:" + e.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmailId = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmailId });
    if (user.length > 0) res.send(user);
    else {
      res.send("user doesn't exist with this email id");
    }
  } catch (e) {
    res.send("something went wrong!");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length) res.send(users);
    else {
      res.send("no user in the DB!");
    }
  } catch (e) {
    res.send("something went wrong!");
  }
});

app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    const data = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully!" + data);
  } catch (e) {
    res.send("something went wrong!");
  }
});

app.patch("/update/:userId", async (req, res) => {
  const data = req.body;
  const userId = req.params.userId;
  try {
    const ALLOWED_UPDATES = ["skills","age","photoUrl","about","gender","firstName"];
    const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
    if(!isUpdateAllowed){
      throw new Error("update not allowed!")
    }
    if(data?.skills.length>10)
    throw new Error("skills can't be more than 10!");
    const updatedData = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("user data update successfully! " + updatedData);
  } catch (error) {
    res.send(error.message);
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
