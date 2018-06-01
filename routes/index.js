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
    //var URL = require('url');
    //res.sendfile('./downloadpage.html');
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    //var args=URL.parse(req.url,true).query;
    res.send("Hello World");
});



router.get('/datav/map', function(req,res){
    //res.sendfile('./downloadpage.html');
    var URL=require('url');
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    var args=URL.parse(req.url,true).query;
    var ken=args.ken;
    //res.send(args.ken);
    var fs=require('fs');
    var jsonObj
    fs.readFile('japanmap.json',function(error,data){
        if (error) throw error;
        jsonObj=JSON.parse(data);
        var kens=jsonObj.features;
        var geometry="";
        var properties="";
        for (i=0;i<kens.length;i++){
            if (kens[i].properties['name']==ken){
                geometry=kens[i]['geometry'];
                properties=kens[i]['properties'];
            }
        }
        var head='{"type": "FeatureCollection","features": [{"type": "Feature","geometry": ""}]}'
        jsonResponse=JSON.parse(head);
        jsonResponse.features[0].geometry=geometry;
        jsonResponse.features[0].properties=properties;
        res.send(jsonResponse);
    });
    
});

router.get('/datav/basemap', function(req,res){
    //res.sendfile('./downloadpage.html');
    var URL=require('url');
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    var args=URL.parse(req.url,true).query;
    var ken=args.ken;
    //res.send(args.ken);
    var fs=require('fs');
    var jsonObj
    fs.readFile('routes/japanmap.json',function(error,data){
        if (error) throw error;
        jsonObj=JSON.parse(data);
        var kens=jsonObj.features;
        var geometry="";
        var properties="";
        for (i=0;i<kens.length;i++){
            if (kens[i].properties['name']==ken){
                geometry=kens[i]['geometry'];
                properties=kens[i]['properties'];
            }
        }
        var coordinates=geometry.coordinates;
        
        sumLat=0;
        sumLng=0;
        for (i=0;i<coordinates[0].length;i++){
            sumLat=coordinates[0][i][1]+sumLat;
            sumLng=coordinates[0][i][0]+sumLng;
        }
        centerLat=sumLat/coordinates[0].length;
        centerLng=sumLng/coordinates[0].length;

        var head='[{"zoom": "7"}]';
        jsonResponse=JSON.parse(head);
        jsonResponse[0].lng=centerLng;
        jsonResponse[0].lat=centerLat;
        //res.send(jsonResponse);
        res.write(JSON.stringify(jsonResponse));
        //res.write(jsonResponse.toString);
        res.end();
    });
    
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