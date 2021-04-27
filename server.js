let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 

app.get('/',(req,res)=>{
    return  res.send({
        error:false,
        massage:'test'
        
    })
})
let dbCon = mysql.createConnection({

    host:'localhost',
    user:'root',
    password:'',
    database:'ci_test',
})
dbCon.connect();

app.get('/users',(req,res)=>{
    dbCon.query('SELECT * FROM users',(error,results,fields)=>{
        if(error) throw error;

        let massage = ''
        if(results === undefined || results.length ==0){
            massage ='emtpy';
        }else{
            massage='success';
        }
        return res.send({error:false,data:results,massage:massage})
    })
})

app.post('/users',(req,res)=>{
    let username =req.body.username;
    let password =req.body.password;

    if(!username||!password){
        return res.status(400).send({status:"400",message:"error"})
    }else{
        dbCon.query('INSERT INTO users(username,password) VALUES(?,?)',[username,password],(error,results,fields )=>{
            if(error) throw error;
            return res.send({ status:200,massage:"success"})
        })
    }
})

app.get('/users/:id',(req,res)=>{
    let id =req.params.id;
    if(!id){
        return res.status(400).send({massage:"invalid"})
    }else{
        dbCon.query("SELECT * FROM users WHERE id = ?",id,(error,results,fields)=>{
            if(error) throw error;

            let massage=""
            if(results === undefined || results.length== 0){
                massage ="empty"
            }else {
                massage ="success"
            }
            return res.send({
                status:200,
                data:results[0],
                massage:massage 

            })
        })
    }

})

app.put('/users',(req,res)=>{
    let id =req.body.id;
    let username =req.body.username;
    let password =req.body.password;

    if(!id || !username || !password){
        return res.status(400).send({
            massage:"Not Found id"
        })
    }else{
        dbCon.query("UPDATE users SET username=?,password=? WHERE id=?",[username,password,id],(error,results,fields)=>{
            if(error) throw error;

            let massage=""

            if(results.changedRows === 0){
                massage ="Not found id Or data same "
            }else{
                massage ="success"
            }
            return res.send({status:200,massage:massage})
        })
    }
})

app.delete('/users',(req,res)=>{
    let id = req.body.id;

    if(!id){
        return res.status(400).send({massage:'Not found id'})
    } else{
        dbCon.query("DELETE FROM users WHERE id=?",[id],(error,results,fields)=>
        {
            if(error) throw error;

            let massage=""
            if(results.affectedRows ===0){
                massage="ID NOT FOUND"
            }else{
                massage="SUCCESS"
            }

            return res.send({status:200,massage:massage})


        } )
    }
})

app.listen(3000,()=>{
    console.log('running');
})

module.exports = app;