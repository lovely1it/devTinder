const express = require("express");
const app=express();

app.use('/test',(req,res)=>{
    res.send("Hello from server path /test!!");
})
app.use("/",(req,res)=>{
    // console.log(req.body)
    res.send("Hello from path / !")
})

app.listen(8888,()=>{
    console.log("server is running at  " +8888+" successfully!")
})