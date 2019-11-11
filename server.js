const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
//var MySQLStore = require('express-mysql-session')(session);
const fs = require('fs');
const data = fs.readFileSync('./MMDB/DB.json');
const conf = JSON.parse(data);
const mysql = require('mysql');
const moment = require('moment');
const multer = require('multer');
        

require('moment-timezone');

const upload = multer({dest: './MMDB/upload'});
//app.use('/uploads',serveStatic(path.join(__dirname, 'uploads')));

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database
});
connection.connect(); 


const Bot = require('./dialog_test.js')
//챗봇 객체 생성 

const DB = require('./MMDB/DBconnserver')

//express 객체 생성
var app = express();

console.log("서버시작");

/*var sessionStore = new MySQLStore(options);

app.use(session({
	secret: '12sdfwerwersdfserwerwef', //keboard cat (랜덤한 값)
	resave: false,
	saveUninitialized: true,
	store: sessionStore
}));*/

app.post('/marketsend', (req, res) => {
  console.log('who get in here post /users');
  let body = [];
  var inputData;
  var senddata;
  req.on('data', (data) => {
    inputData = JSON.parse(data);
    console.log(inputData);
  });

  req.on('end', () => {
    let database = new DB();
    var querys = 'INSERT INTO mm_db.board (id, title, content,day,image) VALUES(?,?,?,?,?)'
    moment.tz.setDefault("Asia/Seoul"); 
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(date);
    var image = inputData.id+"\_"+inputData.image;
    console.log(image);
    connection.query(querys,[inputData.id,inputData.title,inputData.contents,date,image],(err, rows, fields) => {
        if(!err){
            //res.send(rows);
            var check = 'yes';
            res.send({message:{text: check}});
        }else{
            var check = 'no';
            res.send({message:{text: check}});
        }
            
        }
    )
  });
});
app.post('/market', (req, res) => {
  console.log('who get in here post /users');
  let body = [];
  var inputData;
  var senddata;
  req.on('data', (data) => {
    inputData = JSON.parse(data);
    console.log(inputData);
  });

  req.on('end', () => {
    let database = new DB();
    var querys = 'SELECT * FROM mm_db.board'
    connection.query(querys,(err, rows, fields) => {
      if(!err){
          console.log(rows);
          if(!rows[0]){
            var checking = 'No'; 
            res.send(checking);
            console.log(checking);    
          }
          else{
            res.send(rows);
          }
      }else{
        console.log(err);
      }
    });
  });
});

app.post('/diarysend', (req, res) => {
  console.log('who get in here post /users');
  var inputData;
  var senddata;
  console.log(req.body);
  req.on('data', (data) => {
    inputData = JSON.parse(data);
    console.log(inputData);
  });

  req.on('end', () => {
    let database = new DB();
    var querys = 'INSERT INTO mm_db.diary (id, title, content,day,image) VALUES(?,?,?,?,?)'
    moment.tz.setDefault("Asia/Seoul"); 
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(date);
    var image = inputData.id+"\_"+inputData.image;
    console.log(image);
    connection.query(querys,[inputData.id,inputData.title,inputData.contents,date,image],(err, rows, fields) => {
        if(!err){
            //res.send(rows);
            var check = 'yes';
            res.send({message:{text: check}});
        }else{
            var check = 'no';
            res.send({message:{text: check}});
        }
            
        }
    )
  });
});

app.post('/diary', (req, res) => {
  console.log('who get in here post /users');
  var inputData;
  var senddata;
  console.log(req.body);
  req.on('data', (data) => {
    inputData = JSON.parse(data);
    console.log(inputData);
  });

  req.on('end', () => {
    let database = new DB();
    var querys = 'SELECT * FROM mm_db.diary WHERE id = \''+inputData.id+'\''
    connection.query(querys,(err, rows, fields) => {
      if(!err){
          console.log(rows);
          if(!rows[0]){
            var checking = 'No'; 
            res.send(checking);
            console.log(checking);    
          }
          else{
            res.send(rows);
          }
      }else{
        console.log(err);
      }
    });
  });
});



app.post('/post', (req, res) => {
    console.log('who get in here post /users');
    var inputData;
    var senddata;
    req.on('data', (data) => {
      inputData = JSON.parse(data);
    });
 
    req.on('end', () => {
      let chatbot = new Bot(inputData.sessionId,'babytalk-scpoyd',inputData.lang);
      chatbot.sendDialogflows(inputData.query).then((result)=>{
          var test = result[0].queryResult.fulfillmentText;
          if(test[0] == '%'){
            var str = base64_encod('./uploads/%'+test[1]+'.jpg');
            res.send({message:{text: '_'+test.substr(2,test.length) + '_'+str}});

          }
          else if(test[0] == '!'){
            var str = base64_encod('./uploads/!'+test[1]+'.jpg');
            res.send({message:{text: '_'+test.substr(2,test.length) + '_'+str}});
          }
          else{
            res.send({message:{text: result[0].queryResult.fulfillmentText,image : ""}});
            console.log(result[0].queryResult.fulfillmentText);
          }
          
      }).catch(e=>{
          res.send({message:{text:'err'}});
      });
    });
 });
 function base64_encod(file){
   var bitmap = fs.readFileSync(file);
   return new Buffer(bitmap).toString('base64');
 }
 app.post('/login',(req,res) =>{
  console.log('check Login service');
  var inputData_login;
  req.on('data', (data) => {
    inputData_login = JSON.parse(data);
    console.log(inputData_login);
  });

  req.on('end', () => {
    console.log(inputData_login);
    let database = new DB();
    if(inputData_login.checking == '1'){
      var querys = 'SELECT * FROM mm_db.member WHERE id = \''+inputData_login.id+'\'';
      connection.query(querys,(err, rows, fields) => {
        if(!err){
          if(rows[0] == undefined){
            console.log('로그인시도 -> 아이디없음');
            var checking_insert = 'noextantID'; 
            res.send({message:{text: checking_insert}});    
          }
          else if(rows[0].id == inputData_login.id && rows[0].pw != inputData_login.pw){
            console.log('로그인시도 -> 비밀번호틀림');
            var checking_insert = 'falsePW'; 
            res.send({message:{text: checking_insert}});     
          }
          else {
            console.log('로그인시도 -> 로그인성공');
            var checking_insert = 'oklogin'; 
            res.send({message:{text: checking_insert}});   
        }
        }else{
          console.log(err);
        }
      }); 
    }
  });
})

app.post('/join',(req,res) =>{
  console.log('check Join service');
  var inputData_login;
  req.on('data', (data) => {
    inputData_login = JSON.parse(data);
    console.log(inputData_login);
  });

  req.on('end', () => {
    console.log(inputData_login);
    let database = new DB();
    if(inputData_login.checking == '1'){
      var querys = 'SELECT id FROM mm_db.member WHERE id = \''+inputData_login.id+'\'';
      connection.query(querys,(err, rows, fields) => {
        if(!err){
          if(rows[0] == undefined){
            console.log('checking');
            var checking_insert = 'noid'; 
            res.send({message:{text: checking_insert}});     
        }
        else{
            console.log('checking2');
            var checking_insert = 'okid'; 
            res.send({message:{text: checking_insert}});   
        }
        console.log(rows[0]);
        }else{
          console.log(err);
        }
      });
    }
    else if(inputData_login.checking == '2'){
      console.log("닉네임 확인시작");
      var querys = 'SELECT id FROM mm_db.member WHERE id = \''+inputData_login.nick+'\'';
      connection.query(querys,(err, rows, fields) => {
        if(!err){
          if(rows[0] == undefined){
            console.log('checking');
            var checking_insert = 'nonick'; 
            res.send({message:{text: checking_insert}});     
        }
        else{
            console.log('checking2');
            var checking_insert = 'oknick'; 
            res.send({message:{text: checking_insert}});   
        }
        console.log(rows[0]);
        }else{
          console.log(err);
        }
      });
    }
    else if (inputData_login.checking == '3') {
      var querys = 'INSERT INTO mm_db.member VALUES(?,?,?,?)'
      connection.query(querys,[inputData_login.id,inputData_login.pw,inputData_login.name,inputData_login.nick],(err, rows, fields) => {
          if(!err){
              //res.send(rows);
              var check = 'true';
              res.send({message:{text: check}});
          }else{
              var check = 'false';
              res.send({message:{text: check}});
          }
              
          }
      )
    } 
    
  });

})

 app.get('/', function(req, res){
    chatbot = new Bot('SESSION_TO_PROCESS','babytalk-scpoyd','ko-KR');
    res.send('express.js로 만든 server입니다.')
});
app.set('port',3000);

var server = http.createServer(app).listen(app.get('port'),function(){
    console.log("express server start");
});

