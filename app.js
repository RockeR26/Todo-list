const express=require("express");
const app=express();
const body=require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");

app.use(body.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todoDB", {useNewUrlParser: true,useUnifiedTopology: true });
const itemSchema=new mongoose.Schema({
    name:String
});
const Item=mongoose.model("Item",itemSchema);

const wel=new Item({
    name:"Welcome To TO-DO list"
});
const add=new Item({
    name:"Press the + button to add in the list"
});
const del=new Item({
    name:"<-- Check the box to delete"
});

const listSchema=({
    name:String,
    items:[itemSchema]   
});
const List=mongoose.model("List",listSchema);
const def=[wel,add,del];


app.get("/",function(req,res){
        Item.find({},function(err,item){
            if(item.length===0){
        
                Item.insertMany(def,function(err){
                    if(err){
                        console.log("error");
                    }else{
                        console.log("no error");
                        res.redirect("/");
                    }
                });
            }    
            else{
                res.render("list",{date:"Today",item:item});  
            }
        });
});

app.get("/:topic",function(req,res){     
   let topic=_.capitalize(req.params.topic);
    List.findOne({name:topic},function(err,list){
        if(!err){
            if(!list){
                newlist=new List({
                    name:topic,
                    items:def
                });
                newlist.save();
                res.redirect("/"+topic);
            }else{
                res.render("list",{date:list.name,item:list.items});
            }
        }
    });
});

app.post("/",function(req,res){
    item=(req.body.item);
    let topic=req.body.list;
    newItems=new Item({
        name:item
    });
    if(topic==="Today"){
        newItems.save();
        res.redirect("/");
    }else{
        List.findOne({name:topic},function(err,found){
            if(!err){
                found.items.push(newItems);
                found.save();
                res.redirect("/"+topic);
            }
        });
    }
   
});
app.post("/delete",function(req,res){
    const check=req.body.check;
    const hid=req.body.hid
    if(hid==="Today"){
        Item.findByIdAndDelete(check,function(err){
            if(err){
                console.log("error");
            }else{
                res.redirect("/");
            }
        });
    }else{
        List.findOneAndUpdate({name:hid},{$pull:{items:{_id:check}}},function(err,found){
            if(!err){
                res.redirect("/"+hid);
            }
        });
    }
  
});

app.listen(3000,function(){
    console.log("server is up");
});