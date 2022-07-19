const express=require('express');
const app=new express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views",__dirname+"/views");


app.get('/', (req, res) => {
  res.render('index');
})


module.exports={app}