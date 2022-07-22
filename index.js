const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const res = require("express/lib/response");
const MongoClient= require('mongodb').MongoClient;
const assert = require('assert');
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}))
app.use("/assests",express.static("assests"))
dotenv.config();
const dbName = "API"

//connecting with database 
const client = new MongoClient("mongodb+srv://Shriyash:shriyash1a2b@cluster0.1laezrl.mongodb.net/API?retryWrites=true&w=majority");
mongoose.connect(
  process.env.url,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("connected")
);

//Creating schemas for customers,products and orders.
const userSchema = {
  title: String
};
const User = mongoose.model("User",userSchema);

const productSchema = {
  title: String
};
const Product = mongoose.model("Product",productSchema);

const orderSchema = {
  title: String,
  time: String,
  price:String
};
const Order = mongoose.model("Order",orderSchema);

//home page for links and IDS
app.get("/",function(req,res){
  res.render("home")
})
//get and post routes for customers
app.post("/c",function(req,res){  //for viewing customers
  const userName = req.body.newUser;
  const user = new User({
    title: userName
  });
  user.save();
  res.redirect("/view_customers")
})

app.post("/cdelete",function(req,res){     //for deleting customers
  const checkedItemId= req.body.checkbox;
  const db = client.db(dbName)
  const collection = db.collection('users')
  User.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      console.log("Successfullly deleted")
      res.redirect("/view_customers")
    }
  })
})

app.get("/view_customers",function(req,res){  //for viewing customers
    const db = client.db(dbName)
    const collection = db.collection('users')
    collection.find({}).toArray(function(err,user_list){
        assert.equal(err,null);
        res.render("user",{users:user_list})
    })
})

app.get("/add_customers",function(req,res){    //for adding customers
  res.render("add_user")
})

app.get("/delete_customers",function(req,res){   //for deleting customers
  const db = client.db(dbName)
  const collection = db.collection('users')
  collection.find({}).toArray(function(err,user_list){
      assert.equal(err,null);
      res.render("delete_user",{users:user_list})
  })
})

app.get("/customer/:ID",function(req,res){   //for viewing single customer
  const user = req.params.ID;
  const db = client.db(dbName)
  const collection = db.collection('users')
  User.findById(user,function(err,customer){
    res.render("single_user",{user:customer})
  })
})

app.get("/update_customer/:ID",function(req,res){   //for updating customer
  const user = req.params.ID;
  const db = client.db(dbName)
  const updatedUser = req.body.User
  const collection = db.collection('users')
  User.findById(user,function(err,customer){
    if(!err){
    res.render("update_single_user",{user:customer})
    }
  })
})

app.post("/scupdate",function(req,res){    //for updating customer
  const user = req.body.list;
  const db = client.db(dbName)
  const updatedUser = req.body.User
  const collection = db.collection('users')
  User.findByIdAndUpdate(user,{title:updatedUser},function(err,customer){
    if(!err){
    res.redirect("view_customers")
    }
  })
})



//get and post routes for products
app.post("/p",function(req,res){       //for viewing products
  const productName = req.body.newProduct;
  const product = new Product({
    title: productName
  });
  product.save();
  res.redirect("/view_products")
})

app.post("/pdelete",function(req,res){   //for deleting customers
  const checkedItemId= req.body.checkbox1;
  const db = client.db(dbName)
  const collection = db.collection('products')
  Product.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      console.log("Successfullly deleted")
      res.redirect("/view_products")
    }
  })
})

app.get("/view_products",function(req,res){      //for viewing products
  const db = client.db(dbName)
  const collection = db.collection('products')
  collection.find({}).toArray(function(err,product_list){
      assert.equal(err,null);
      res.render("product",{products:product_list})
  })
})

app.get("/add_products",function(req,res){       //for adding products
  res.render("add_product")
})

app.get("/delete_products",function(req,res){   //for deleting products
  const db = client.db(dbName)
  const collection = db.collection('products')
  collection.find({}).toArray(function(err,product_list){
      assert.equal(err,null);
      res.render("delete_product",{products:product_list})
  })
})

app.get("/product/:ID",function(req,res){          //for viewing single product
  const product = req.params.ID;
  const db = client.db(dbName)
  const collection = db.collection('products')
  Product.findById(product,function(err,pro){
    res.render("single_product",{product:pro})
  })
})

app.get("/update_product/:ID",function(req,res){    //for updating product
  const product = req.params.ID;
  const db = client.db(dbName)
  const updatedUser = req.body.Product
  const collection = db.collection('products')
  Product.findById(product,function(err,pro){
    if(!err){
    res.render("update_single_product",{product:pro})
    }
  })
})

app.post("/spupdate",function(req,res){      //for updating product
  const product = req.body.list;
  const db = client.db(dbName)
  const updatedProduct = req.body.Product
  const collection = db.collection('products')
  Product.findByIdAndUpdate(product,{title:updatedProduct},function(err,pro){
    if(!err){
    res.redirect("view_products")
    }
  })
}) 




//get and post routes for orders
app.post("/o",function(req,res){             //for viewing orders
  const orderName = req.body.newOrder;
  const user_time = req.body.newTime;
  const user_price = req.body.price
  const order = new Order({
    title: orderName,
    time: user_time,
    price: user_price
  });
  order.save();
  res.redirect("/view_orders")
})

app.post("/odelete",function(req,res){     //for deleting orders
  const checkedItemId= req.body.checkbox;
  const db = client.db(dbName)
  const collection = db.collection('orders')
  Order.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      console.log("Successfullly deleted")
      res.redirect("/view_orders")
    }
  })
})

app.get("/view_orders",function(req,res){    //for viewing orders
  const db = client.db(dbName)
  const collection = db.collection('orders')
  collection.find({}).toArray(function(err,order_list){
      assert.equal(err,null);
      res.render("order",{orders:order_list})
  })
})

app.get("/delete_orders",function(req,res){ //for deleting orders
  const db = client.db(dbName)
  const collection = db.collection('orders')
  collection.find({}).toArray(function(err,order_list){
      assert.equal(err,null);
      res.render("delete_order",{orders:order_list})
  })
})

app.get("/add_orders",function(req,res){  //for adding orders
  res.render("add_order")
})

app.get("/order/:ID",function(req,res){ // for viewing single order
  const order = req.params.ID;
  const db = client.db(dbName)
  const collection = db.collection('orders')
  Order.findById(order,function(err,ord){
    res.render("single_order",{order:ord})
  })
})

app.get("/update_order/:ID",function(req,res){ //for updating order
  const order = req.params.ID;
  const db = client.db(dbName)
  const updatedOrder = req.body.Order
  const collection = db.collection('orders')
  Order.findById(order,function(err,ord){
    if(!err){
    res.render("update_single_order",{order:ord})
    }
  })
})

app.post("/soupdate",function(req,res){     //for updating order
  const order = req.body.list;
  const db = client.db(dbName)
  const updatedOrder = req.body.Order
  const updatedTime = req.body.time
  const updatedPrice = req.body.price
  const collection = db.collection('orders')
  Order.findByIdAndUpdate(order,{title:updatedOrder,time:updatedTime,price:updatedPrice},function(err,ord){
    if(!err){
    res.redirect("view_orders")
    }
  })
})

//lisening on the given port
app.listen(900, () => console.log("server up and runing on port 900!"));
