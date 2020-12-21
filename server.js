const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tobiloba123",
    database:"recycle_db"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!"); 
  });

const app = express();


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
    con.query("SELECT * FROM home", function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
})

app.get('/carousel', (req,res) => {
    con.query("SELECT * FROM carousel", function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
})

app.get('/footer', (req,res) => {
    con.query("SELECT * FROM footer", function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
})

app.get('/about', (req,res) => {
    con.query("SELECT * FROM about", function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });;
})

app.get('/whatweoffer', (req,res) => {
    con.query("SELECT * FROM about_whatweoffer", function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });;
})

app.post('/contact', (req,res) => {
    //send data to admin email
})

app.post('/admin', (req, res) => {
    con.query("SELECT * FROM login", function (err, result, fields) {
        if (err) throw err;
        console.log(result[0].username);
        if (req.body.username === result[0].username && req.body.password === result[0].password) {
            res.json('Login Succesful')
        } else {
            res.status(400).json('error logging in')
        }
    });
    
})

app.put('/admin/home', (req, res) => {
    const {part, img_url, header, paragraph1, paragraph2} = req.body;
    con.query(`UPDATE home SET img_url = '${img_url}', header = '${header}', paragraph1 = '${paragraph1}', paragraph2 = '${paragraph2}' WHERE part = '${part}'`, function (err, result, fields) {
        if (err) throw err;
        res.send('Success');
    });
})

app.put('/admin/about', (req, res) => {
    const {part, img_url, header, paragraph1, paragraph2, paragraph3} = req.body;
    con.query(`UPDATE about SET img_url = '${img_url}', header = '${header}', paragraph1 = '${paragraph1}', paragraph2 = '${paragraph2}', paragraph3 = '${paragraph3}' WHERE part = '${part}'`, function (err, result, fields) {
        if (err) throw err;
        res.send('Success');
    });
    
})
app.put('/admin/footer', (req, res) => {
    const {email, phone, address} = req.body;
    con.query(`UPDATE footer SET phone = '${phone}', email = '${email}', address = '${address}' WHERE id = '1'`, function (err, result, fields) {
        if (err) throw err;
        res.send('Success');
    });
    
})
app.put('/admin/carousel-insert', (req, res) => {
    const {id, header, content, name, work} = req.body;
    con.query(`INSERT INTO carousel (header, content, name, work) VALUES ('${header}', '${content}', '${name}', '${work}')`, function (err, result, fields) {
        if (err) throw err;
        res.send('Success');
    });
})
app.put('/admin/carousel-delete', (req, res) => {
    const {id} = req.body;
    con.query(`DELETE FROM carousel WHERE id = '${id}'`, function (err, result, fields) {
        if (err) throw err;
        res.send('Success');
    });
})



app.listen(3001, () => {
    console.log('app is running')
})