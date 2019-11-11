const fs = require('fs');
class DBconect{
    constructor(){
        this.data = fs.readFileSync('./MMDB/DB.json');
        this.conf = JSON.parse(this.data);
        this.mysql = require('mysql');
        this.multer = require('multer');
        this.upload = this.multer({dest: './MMDB/upload'});
        this.connection = this.mysql.createConnection({
            host: this.conf.host,
            user: this.conf.user,
            password: this.conf.password,
            port: this.conf.port,
            database: this.conf.database
        });
        this.connection.connect();   
    }
    inserts(id,pw,name,nic){
        var checking_insert = true;
        var querys = 'INSERT INTO mmdb.member VALUES(?,?,?,?)'
        this.connection.query(querys,[id,pw,name,nic],(err, rows, fields) => {
            if(!err){
                //res.send(rows);
                console.log(id);
            }else{
                checking_insert = false;
            }
                
            }
        )
        return checking_insert;
    }


    overlap_id(id){
        var checking_insert = 'before';
        var querys = 'SELECT id FROM mmdb.member WHERE id = \''+id+'\'';
        this.connection.query(querys,(err, rows, fields) => {
            if(!err){
                if(rows[0] == undefined){
                    console.log('checking')
                    checking_insert = 'noid';      
                }
                else{
                    checking_insert = 'okid';
                }
                
            }else{
                checking_insert = 'errnick';
                console.log('false');
            }
                
            }
        )
        if(checking_insert != 'before'){
            return checking_insert;
        }
    }
    

    overlap_nick(nick){
        var checking_insert = 'oknick';
        var querys = 'SELECT nick FROM mmdb.member WHERE nick = \''+nick+'\'';
        console.log(querys);

        this.connection.query(querys,(err, rows, fields) => {
            if(!err){
                console.log(rows);
                var test2 = [];
                if(JSON.stringify(rows) == JSON.stringify(test2)){
                    checking_insert = 'nonick';      
                }
                else{
                    checking_insert = 'oknick';
                }
                
            }else{
                checking_insert = 'errnick';
                console.log('false');
            }
                
            }
        )
        
        return checking_insert;
    }
}
module.exports = DBconect;