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
    res.send('Welcome to tinysun!');
});

app.post('/login-check', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var data = {
        username: username,
        password: password
    };
    sequelize.query('SELECT * FROM users WHERE username = :username and password = :password ', { 
        replacements: data,
        type: sequelize.QueryTypes.SELECT 
    }).then(users => {
        if(users.length == 0){
            res.json({status: -1});
        }
        else{
           if(users[0].role == 1) res.json({status: 1});
           else res.json({status: 2, id: users[0].id});
        }
    });
});

app.get('/teacher',function(req, res){
    var teacher_id = req.query.id;
    var data = {
        id: teacher_id
    };
    var stus;
    var prob;
    sequelize.query('select * from students where teacher_id = :id', {
        replacements: data, 
        type: sequelize.QueryTypes.SELECT
    }).then(students => {
        stus = students;
        //console.log(stus);
        //res.json({info: students});
        //console.log(students[0].already);
    });
    sequelize.query('select problem, total from problems where teacher_id = :id', {
        replacements: data,
        type: sequelize.QueryTypes.SELECT
    }).then(problems => {
        prob = problems;
        res.json({stu: stus, prob: prob});
        //console.log(prob);
        //console.log(problems);
    })
    //res.json({info: stus, prob: prob});
})

app.get('/student',function(req, res){
    var student_id = req.query.id;
    var data = {
        id: student_id
    };
    sequelize.query('select * from problems where teacher_id in (select teacher_id from students where student_id = :id)', {
        replacements: data,
        type: sequelize.QueryTypes.SELECT
    }).then(problems => {
        res.json({problems: problems})
    });
})

app.post('/upload-grade', function(req, res){
    var student_id = req.body.id;
    var already = req.body.already;
    var data = {
        id: student_id,
        already: already 
    };
    /*
    sequelize.query('select already from students where student_id :id', {
        replacements: data1,
        type: sequelize.QueryTypes.SELECT
    }).then(students => {
        already_oall = students[0].already;
    });
    var already_all = already_oall + already;
    var data2 = {
        id: student_id,
        already: already_all,

    }*/
    sequelize.query('updata students set already = already + :alread where student_id = :id', {
        replacements: data,
        type: sequelize.QueryTypes.UPDATE
    }).spread((results, metadata) => {
        if(metadata == 1){
            res.json({status: 1});
        }
        else res.json({status: 0});
    });
})

app.post('/upload-problems', function(req, res){
    var teacher_id = req.body.id;
    var problem = req.body.problem;
    var num = req.body.num;
    var data = {
        id: teacher_id,
        problem: problem,
        num: num
    };
    sequelize.query('update problems set problem = :problem and total = total + :num where teacher_id = :id', {
        replacements: data,
        type: sequelize.QueryTypes.UPDATE
    }).spread((results, metadata) => {
        if(metadata == 1){
            res.json({status: 1});
        }
        else res.json({status: 0});
    });
})

app.listen(3000, function () {
    console.log('app is listening at port 3000');
});