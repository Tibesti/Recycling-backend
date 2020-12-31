const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tobiloba123",
    database:"recycle_db"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Database!"); 
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

app.get('/servicesorproducts', (req,res) => {
    con.query("SELECT * FROM home_products", function (err, result, fields) {
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

app.get('/about-images', (req,res) => {
    con.query("SELECT * FROM about_images", function (err, result, fields) {
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
    const {name, email, phone, company, message} = req.body;
    const smtpTrans = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'tobilobaolugbemi@gmail.com',
          pass: 'tobiloba123'
        },
        tls: {
            rejectUnauthorized: false //this helped with one certificate authorization problem related to google
        }
    })
    const mailOpts = {
        from: `${name}`, // This is ignored by Gmail
        to: `tobilobaolugbemi@gmail.com`,
        subject: 'New message from contact form at tylerkrys.ca',
        text: `${name} (${email}, ${phone}) says: ${message}`
    }
    smtpTrans.sendMail(mailOpts, (error, response) => {
        if (error) {
          res.send('Failed'); // Show a page indicating failure
          console.log(error)
        }
        else {
          res.send('Success') // Show a page indicating success
        }
    })
})

app.post('/admin/login', (req, res) => {
    con.query("SELECT * FROM login", function (err, result, fields) {
        if (err) throw err;
        console.log(result[1].username);
        if (req.body.username === result[1].username && req.body.password === result[1].password) {
            res.json('Login Successful')
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

app.put('/admin/about-images', (req, res) => {
    const {first_image, second_image} = req.body;
    con.query(`UPDATE about_images SET first_image = '${first_image}', second_image = '${second_image}' WHERE id = '3'`, function (err, result, fields) {
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
app.post('/admin/home-product-insert', (req, res) => {
    const {product_name, image_url} = req.body;
    con.query(`INSERT INTO home_products (product_name, image_url) VALUES ('${product_name}', '${image_url}')`, function (err, result, fields) {
        if (err) throw err;
        res.send('Success');
    });
})
app.delete('/admin/home-product-delete', (req, res) => {
    const {id} = req.body;
    con.query(`DELETE FROM home_products WHERE id = '${id}'`, function (err, result, fields) {
        if (err) throw err;
        res.send('Success');
    });
})
app.post('/admin/carousel-insert', (req, res) => {
    const {id, header, content, name, work} = req.body;
    con.query(`INSERT INTO carousel (header, content, name, work) VALUES ('${header}', '${content}', '${name}', '${work}')`, function (err, result, fields) {
        if (err) throw err;
        res.send('Success');
    });
})
app.delete('/admin/carousel-delete', (req, res) => {
    const {id} = req.body;
    con.query(`DELETE FROM carousel WHERE id = '${id}'`, function (err, result, fields) {
        if (err) throw err;
        res.send('Success');
    });
})

app.delete('/admin/whatweoffer-delete', (req, res) => {
    const {id} = req.body;
    con.query(`DELETE FROM about_whatweoffer WHERE id = '${id}'`, function (err, result, fields) {
        if (err) throw err;
        res.send('Success');
    });
})

app.post('/admin/whatweoffer-insert', (req, res) => {
    const {list} = req.body;
    con.query(`INSERT INTO about_whatweoffer (list) VALUES ('${list}')`, function (err, result, fields) {
        if (err) throw err;
        res.send('Success');
    });
})



app.listen(3001, () => {
    console.log('app is running')
})