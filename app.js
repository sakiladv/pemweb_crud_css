const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Middleware untuk body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pemweb6'
});

connection.connect((err) => {
    if(err) {
        console.error("Terjadi kesalahan dalam koneksi MYSQL:" , err.stack);
        return;
    }
    console.log("Connection MYSQL berhasil dengan id" + connection.threadId);
});

app.set('view engine' , 'ejs');

//this is routing (create,read,update,delete)
//read
app.get('/' , (req , res) =>{
    const query = 'SELECT * FROM users';
    connection.query(query , (err , results) => {
        res.render('index' , {users: results});
    });
});


//create/input/insert
app.post('/add' , (req , res) =>{
    const{nama, email, phone} = req.body;
    const query = 'INSERT INTO users(nama, email, phone) VALUES (?,?,?)';
    connection.query(query , [nama, email, phone] , (err, result) =>{
        if(err) throw err;
        res.redirect('/');
    });

});

// Update
app.get('/edit/:id', (req, res) => {
    const query = 'SELECT * FROM users WHERE id= ?';
    connection.query(query, [req.params.id] , (err, result) => {
      if (err) throw err;
      res.render('edit', { user: result[0] });
    });
  });
  
  app.post('/update/:id', (req, res) => {
    const{nama, email, phone} = req.body;
    const query = 'UPDATE users SET nama=? , email=? , phone=? WHERE id=?';
    connection.query(query , [nama, email, phone, req.params.id] , (err, result) =>{
        if(err) throw err;
        res.redirect('/');
    });
  });

//hapus
app.get("/delete/:id", (req, res) => {
    const query = "DELETE FROM users WHERE id= ?";
    connection.query(query, [req.params.id], (err, result) => {
      if (err) throw err;
      res.redirect("/");
    });
  });


app.listen(3000 , () =>{
    console.log('server berjalan di ports 3000, buka web melalui http://localhost:3000');
});

