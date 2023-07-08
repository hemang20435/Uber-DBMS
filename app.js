const express = require('express');
const { result } = require('lodash');
const app = express();
const router = express.Router();

// var flash = require('express-flash');


// const exphbs=require('express-handlebars');
// const bodyParser=require('body-parser');
// app.use(bodyParser.urlencoded({extended: false}))


// listen for requests 


app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded());

const mysql = require('mysql');

// var conn = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "12345678",
//     database: "Uber"
// });

// conn.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
// });

// module.exports = conn;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "Uber"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

let name = "Default";
let urname = "Default";

// app.use(flash());
app.get('/', (req,res)=>{
    res.render('home');
});

app.get('/login', (req,res)=>{
    res.render('login');
});

app.post('/login', (req,res)=>{
    console.log(req.body);

    name = req.body.username;

    var usernm = req.body.username;
    var pass = req.body.password;
    
    var sql = 'SELECT * FROM Registered WHERE username="'+usernm+'" AND password= "'+pass+'"';
    db.query(sql, function(err, result) {
        if (err) throw(err);
        console.log(result);

        if (result.length==0) {
            res.redirect('/login');
        }
        else if(result.length!=0) {
            console.log('Record Found');
            res.redirect('/ask');
        }
    });
    
    
});

app.get('/register', (req,res)=>{
    res.render('register', {title : 'Register'});
});

app.post('/register', (req, res)=> {
    var name = req.body.name;
    var username = req.body.username;
    var phone = req.body.phone;
    var age =  req.body.age;
    var password = req.body.password;
    // console.log(req.body.name);
    
    
   
    var sql = `INSERT INTO Registered (name, username, phone, age, password) VALUES ("${name}", "${username}", "${phone}", "${age}", "${password}")`;
    db.query(sql, function(err, result) {
        if (err) {
            res.render('register');
            // throw err;
        }
        console.log('record inserted');
        
        res.redirect('/login');
    });
    
});

app.get('/ask', (req,res)=>{
    res.render('ask');
});

app.get('/customer/add', (req,res)=>{
    console.log(name);
    res.render('customer', {title : name});
});
// Customer Form
let curr_loc="Default";
let dest="Default";

app.post('/customer/add', (req,res)=>{

    //console.log(res);
    // res.render('customer', {title : name});
    var current_location = req.body.current_location;
    var destination = req.body.destination;

    curr_loc = current_location;
    dest = destination;

    var sql = 'DELETE FROM Customer_Form WHERE username="'+name+'";'
    db.query(sql, function(err, result) {
        if (err) throw err;
        
            console.log('record Deleted');

            // res.redirect('/customer/booked');
    });

    var sql = 'INSERT INTO Customer_Form(username,currentlocation,destination) VALUES ("'+name+'", "'+current_location+'", "'+destination+'")';
    db.query(sql, function(err, result) {
        if (err) throw err;
        
        if (result.length==0) {
            // res.redirect('/driver/add');
        }
        else {
            console.log('record inserted');
            // res.redirect('/driver/added');
        }
            
    });
    
    
    db.query('SELECT * FROM Driver_Form WHERE current_location = "'+current_location+'"',function(err,rows)     {
    
        console.log(rows);
        res.render('booking',{page_title:"Users - Node.js",data : rows});
        // res.redirect('/customer/booking');
        
    });
});


app.get('/ask2', (req,res)=>{
    console.log(name);
    res.render('ask2', {title : name});
});

app.get('/driver/add', (req,res)=>{
    console.log(name);
    res.render('driver', {title : name});
});
// Driver Form
app.post('/driver/add', (req,res)=>{

    console.log(res);
    
    var current_location = req.body.current_location;
    var license_number = req.body.license_number;
    var occupency = req.body.Occupency;
    
    // var sql2 = `INSERT INTO Driver_Form (username, current location, license number) VALUES ("${name}", "${current_location}", "${license_number}")`;
    var sql = 'INSERT INTO Driver_Form(username,current_location,license_number,Occupency) VALUES ("'+name+'", "'+current_location+'", "'+license_number+'","'+occupency+'")';
    db.query(sql, function(err, result) {
        if (err) {
            throw err; 
        } 
        
        if (result.length==0) {
            res.redirect('/driver/add');
        }
        else {
            console.log('record inserted');
            res.redirect('/driver/added');
        }
            
    });
});

app.get('/driver/added', (req,res)=>{
    console.log(name);
    res.render('driver_added', {title : name});
});

app.get('/driver/check', (req,res)=>{
    console.log(name);
    console.log(name);
    console.log(name);
    // name='sidhu'
    db.query('SELECT * FROM bookings WHERE Driver_name = "'+name+'"',function(err,rows)     {
    
        console.log(rows);
        res.render('driver_check',{page_title:"Users - Node.js",data : rows});
        

    });
    
});

app.get('/customer/booking', (req,res)=>{
    console.log(name);
    res.render('booking', {title : name});
});

app.post('/customer/booking', (req, res)=> {
    var username = req.body.username;
    var mode = req.body.mode;
    // urname=username;
    console.log(req.body);
    // console.log(username)
    var sql = 'DELETE FROM bookings WHERE Driver_name="'+username+'";'
    db.query(sql, function(err, result) {
        if (err) throw err;
        
            console.log('record Deleted');

            // res.redirect('/customer/booked');
    });
    
    // console.log(req.body);
    let Price=Math.floor((Math.random() * 800) + 200);
    var sql = 'INSERT INTO bookings(customer_name,Driver_name,current_location,destination,Price,Mode) VALUES ("'+name+'", "'+username+'", "'+curr_loc+'", "'+dest+'", "'+Price+'", "'+mode+'")';
    db.query(sql, function(err, result) {
        if (err) throw err;
        
            console.log('record inserted');

            res.render('booked',{page_title:"Users - Node.js",customer_name : name, Driver_name : username, current_location : curr_loc, destination : dest, Price : Price, Mode : mode});
            // res.redirect('/customer/booked');
    });
    // db.query('SELECT * FROM Driver_Form WHERE current_location = "'+location+'"',function(err,rows)     {
    
    //     console.log(rows);
    //     res.render('booked',{page_title:"Users - Node.js",data : rows});
    //     // res.redirect('/customer/booking');
        
    // });
    
    
});


app.get('/customer/booked', (req,res)=>{
    console.log(name);
    res.render('booked', {title : name});

});






app.listen(3000, () => console.log('Listening on port 3000'));

app.use('/url',(req, res)=> {
    res.status(404).render('404',{title : '404'})
})