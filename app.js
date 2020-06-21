const express=require("express");
const app=express();
const body=require("body-parser");

app.use(body.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

let item=["First Task"];

app.get("/",function(req,res){
    let date=new Date();
    options={
        day:"numeric",
        weekday:"short",
        month:"short",
        year:"numeric"
    };
    let day=date.toLocaleDateString("hi-IN",options);
    console.log(day);
    res.render("list",{date:day,item:item});
});
app.post("/",function(req,res){
 item.push(req.body.item);
 res.redirect("/");
});

app.listen(3000,function(){
    console.log("server is up");
})