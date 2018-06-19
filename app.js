/**
 * @fileOverview Tinysun后端
 * @name app.js
 * @author 杜昊桐
 */

//引入模块
var express = require('express')
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var app = express()

//设置数据库连接属性
const sequelize = new Sequelize('tinysun', 'tinysun', '123', {
    host: '39.105.8.165',
    dialect: 'mysql',
    operatorsAliases: false
});

//设置body-parser模块
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//index
app.get('/', function(req, res){
    res.send('Welcome to tinysun!');
});

/**
 * 用户登录检查
 * @param {object} req 请求
 * @returns {json{status: 0, 1 or 2}} json数据
 * @description 根据用户角色返回不同状态，老师返回2、学生返回1，登录错误返回0
 */
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

/**
 * 老师获取学生信息
 * @param {object} req 请求
 * @returns {json{stus:{}, prob:{}}} json数据
 * @description stus返回学生信息，prob返回题目总数
 */
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
    });
    sequelize.query('select problem, total from problems where teacher_id = :id', {
        replacements: data,
        type: sequelize.QueryTypes.SELECT
    }).then(problems => {
        prob = problems;
        res.json({stu: stus, prob: prob});
    })
})

/**
 * 学生获取题目
 * @param {object} req 请求
 * @returns {json{problems:{}}} json数据
 * @description problems返回题目数量与内容
 */
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

/**
 * 上传完成率
 * @param {object} req 请求
 * @returns {json{status: 0 or 1 }} json数据
 * @description 成功返回1，失败返回0
 */
app.post('/upload-grade', function(req, res){
    var student_id = req.body.id;
    var already = req.body.already;
    var data = {
        id: student_id,
        already: already 
    };
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

/**
 * 上传题目
 * @param {object} req 当前的请求
 * @returns {json{status: 0 or 1 }} json数据
 * @description 成功返回1，失败返回0
 */
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

//监听3000端口
app.listen(3000, function () {
    console.log('app is listening at port 3000');
});