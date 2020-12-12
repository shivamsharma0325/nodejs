var express = require('express');
const app = express();
var mysql = require('mysql');
var bodyparser = require('body-parser');
var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database: 'mycommentapic'
});
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
// POST REQUEST FOR REGISTRATION OPERATION
app.post('/register/',(req,res,next)=>{
    var data = req.body;
    var name= data.name;
    var email = data.email;
    var password = data.password;
    

    console.log(email+" "+password);
    connection.query("SELECT * FROM login_info WHERE email = ?",[email],function(err,result,fields){
        connection.on('error',(err)=>{
            console.log("[Mysql error",err);
        });
        if(result && result.length){
            res.json("User already exists");
        }
        else{
            var insert_cmd = "INSERT INTO login_info(name,email,password) values (?,?,?)";
            values = [name,email,password];
            console.log("executing "+insert_cmd);
            connection.query(insert_cmd,values,(err,results,fields)=>{
                connection.on('err',(err)=>{
                    console.log("[Mysql error]", err);
                });
                res.json("User Registered");
                console.log("Registration successfull");
            });
        }
    });
});


//POST REQUEST FOR LOGIN OPERATION
app.post('/login/',(req,res,next)=>{
    var data = req.body;
    var email = data.email;
    var password = data.password;
    connection.query("SELECT * FROM login_info WHERE email = ?", [email],(err,result,fields)=>{
        connection.on('error',(err)=>{
            console.log("[Mysql error]",err);
        });
        if(result && result.length){
            console.log(result);
            if(password==result[0].password){
                res.json("User logged in");
                res.end;
            }
            else{
                res.json("Wrong password");
                res.end;
            }
        }
        else{
            res.json("User not found");
            res.end;
        }
    });
    


});

// POST REQUEST FOR ADDING PRODUCT OPERATION
app.post('/commenthome/',(req,res,next)=>{
    var data = req.body;
    var name = data.name;
    var comment = data.comment;

    connection.query("SELECT * FROM comment_info WHERE name = ?", [name],function(err,result,fields){
        connection.on('error',(err)=>{
            console.log("[Mysql error]", err);

        });
        if(result && result.length){
            res.json("Comment is added");
        }
        else{
            var insert_cmd = "INSERT INTO comment_info(name,comment) values (?,?)";
            var values = [name,comment];
            console.log(result);
            console.log("executing" +insert_cmd+ "" +values);

            connection.query(insert_cmd,values,(err,results,fields)=>{
                connection.on("err", (err)=>{
                    console.log("[Mysql error]",err);
                });
                res.json("Comment is added");
                console.log("Comment added successfuly");
            });
        }
    });
});

var server = app.listen(3000,()=>{
    console.log("Server running at http://localhost:3000");
});