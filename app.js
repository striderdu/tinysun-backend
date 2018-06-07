var express = require('express')
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var app = express()

const sequelize = new Sequelize('tinysun', 'tinysun', '123', {
    host: '39.105.8.165',
    dialect: 'mysql',
    operatorsAliases: false
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res){ 
    sequelize.query("SELECT * FROM `users`", { type: sequelize.QueryTypes.SELECT})
      .then(function(users) {
        console.log(users);
      })
    res.send('Users');
});

app.post('/login-check', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var results = {};
    var data = {username: username, password: password};
    sequelize.query('SELECT * FROM users WHERE username = :username and password = :password ',
        { replacements: data, type: sequelize.QueryTypes.SELECT }
    ).then(users => {
        results = users;
        console.log(users);
        console.log(results);
        if(results.length == 0){
            res.json({status:-1});
        }
        else res.json({status:1});
    });
});

app.listen(3000, function () {
    console.log('app is listening at port 3000');
});