const express= require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

const socket=require('socket.io');

mongoose.Promise = global.Promise;

const {Schema}= mongoose;

const app=express();
const server=app.listen(3000);
const io= socket(server);

const addG = new Schema({

    fn:{
        type:"String"
    }, 
    ln:{
        type:"String"
    }, 
    cnic:{
        type:"Number",
        required:"please provide cnic"
    }

});
 mongoose.model('users',addG);
 const addUser=mongoose.model('users');
mongoose.connect('mongodb://localhost:27017/guestapp?retryWrites=true',{ useNewUrlParser: true});


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/disp.html");
});



app.get("/dashboard", (req, res) => {
    res.sendFile(__dirname + "/dash.html");
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


io.on('connection',(socket)=>
{


    
socket.on('entry',data=>
{

    new addUser({ fn: data.fn, ln: data.ln, cnic: data.cnic }).save();
    io.sockets.emit('show',data);
});


socket.on('exit',data=>
{
    console.log(data.cnic);
    addUser.findOneAndDelete({cnic:data.cnic}).then((i)=>{console.log("Deleted")});
    io.sockets.emit('showdel',data);
});
})