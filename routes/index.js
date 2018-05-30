var express = require('express');
var router = express.Router();
var fs=require('fs');
var crypto = require('crypto');

router.get('/', function(req,res){
    res.render('index',{});
});

// add test 
//here is RackHD
router.get('/RackHD_ALLServer',function(req,res){
    res.render('RackHD_AllServer',{});
});

router.get('/RackHD_OBM',function(req,res){
    res.render('RackHD_OBM',{})
});
//RackHD End

//here is AttendancePro Start
router.get('/AttendancePro',function(req,res){
    res.render('AttendancePro',{message:''});
});

router.post('/AttendancePro_Start',function(req,res){
    var exec=require('child_process').exec;
    var arg1=req.body.name;
    var arg2=req.body.pass;
    exec('python public/attendancepro_start.py ' + arg1 + ' ' + arg2,function(err,stdout,stderr){
        if (stdout.length>1) console.log(stdout);
        if (err) console.log('stderr: '+stderr);
        res.render('AttendancePro',{message:stdout});
    });
    var message="the message have been sent to AttendancePro";
    res.setHeader("Content-Type","application/json");
    res.write(JSON.stringify({message}));
    res.end();
});


router.post('/AttendancePro_End',function(req,res){
    var exec=require('child_process').exec;
    var arg1=req.body.name;
    var arg2=req.body.pass;
    exec('python public/attendancepro_end.py ' + arg1 + ' ' + arg2,function(err,stdout,stderr){
        if (stdout.length>1) console.log(stdout);
        if (err) console.log('stderr: '+stderr);
    });
    var message="the message have been sent to AttendancePro";
    res.setHeader("Content-Type","application/json");
    res.write(JSON.stringify({message}));
    res.end();
});
//AttendancePro End

router.get('/test', function(req,res){
    //res.sendfile('./downloadpage.html');
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    res.send('hello world');
});

router.get('/datav/factory', function (req, res) {
    //res.sendfile('./downloadpage.html');
    //var message="Hi, this is a datav message";
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'rm-e9b68rq6mmpotwv404o.mysql.japan.rds.aliyuncs.com',
        user: 'wangzz',
        password: 'itageEMC0824',
        database: 'datav'
    });

    connection.connect();

    var message = [];
    connection.query('SELECT * FROM factory', function (error, results, fields) {
        if (error) throw error;

        for (var i = 0; i < results.length; i++) {
            var k = {
                "dotid": results[i].dotid,
                "lat": results[i].lat,
                "lng": results[i].lng,
                "value": results[i].value,
                "info": results[i].info,
                "type": results[i].type,
                "name": results[i].name
            }
            message[i] = k;
        }
        
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(message));
        res.end();

    });
    connection.end();


    // var hk={
    //     "dotid": 0,
    //     "lat": 43.06417,
    //     "lng": 141.34694,
    //     "value": 40,
    //     "info": "hokkaido",
    //     "type": "error",
    //     "name": "hk",
    //     "rotationAngle": 45
    //   };

    // var tk={
    //     "dotid": 1,
    //     "lat": 35.6811673,
    //     "lng": 139.7670516,
    //     "value": 60,
    //     "info": "Tokyo",
    //     "type": "ok",
    //     "name": "tk"
    //   };

    // var fk={
    //     "dotid": 2,
    //     "lat": 33.596302,
    //     "lng": 130.410784,
    //     "value": 20,
    //     "info": "fukuoka",
    //     "type": "ok",
    //     "name": "fk"
    //   };

    // var ok={
    //     "dotid": 3,
    //     "lat": 34.702485,
    //     "lng": 135.495951,
    //     "value": 20,
    //     "info": "oosaka",
    //     "type": "error",
    //     "name": "ok"
    //   };

    // var message=[hk,tk,fk,ok];

    // res.setHeader("Content-Type", "application/json");
    // res.write(JSON.stringify(message));
    // res.end();
});


router.get('/filelist', function(req,res){
    res.render('../views/filelist.html',{title: 'it is a test title'});
});

router.get('/downloadpage',function(req,res){
    // Disable caching for content files
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

    var root_path="../public";
    var resp = [];
    var files = fs.readdirSync(root_path);
    files.forEach(function(file){
        var pathname = root_path+'/'+file;
        var stat = fs.lstatSync(pathname);
        if (!stat.isDirectory()){
            resp.push(pathname.replace(root_path,'.'));
        }
        console.log(file.toString());
    });
    //res.write(resp.pop());
    //res.end();

    res.render('downloadpage.ejs',{filelist: resp});
});

var multipart = require('connect-multiparty');

router.post('/upload', multipart(), function(req, res){
    //get filenames
    var filename = req.files.files.originalFilename || path.basename(req.files.files.ws.path);

    //copy file to a public directory
    var targetPath = path.dirname(__filename) + '/public/' + filename;
    //copy file
    fs.createReadStream(req.files.files.ws.path).pipe(fs.createWriteStream(targetPath));
    //return file url
    res.json({code: 200, msg: {url: 'http://' + req.headers.host + '/' + filename}});
});

module.exports = router;