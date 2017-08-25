var express = require('express');
var router = express.Router();
var fs=require('fs');
var crypto = require('crypto');

router.get('/', function(req,res){
    res.render('index',{});
});

router.get('/AttendancePro',function(req,res){
    res.render('AttendancePro',{message:''});
});

router.get('/AttendancePro_Start',function(req,res){
    var exec=require('child_process').exec;
    var arg1="149186";
    var arg2="itageEMC0824";
    exec('python public/attendancepro_start.py ' + arg1 + ' ' + arg2,function(err,stdout,stderr){
        if (stdout.length>1) console.log(stdout);
        if (err) console.log('stderr: '+stderr);
        res.render('AttendancePro',{message:stdout});
    });
    //res.render('AttendancePro',{message:stdout});
});

router.get('/AttendancePro_End',function(req,res){
    var exec=require('child_process').exec;
    var arg1="149186";
    var arg2="itageEMC0824";
    exec('python public/attendancepro_end.py ' + arg1 + ' ' + arg2,function(err,stdout,stderr){
        if (stdout.length>1) console.log(stdout);
        if (err) console.log('stderr: '+stderr);
        res.render('AttendancePro',{message:stdout});
    });
    //res.render('AttendancePro',{message:stdout});
});

router.get('/test', function(req,res){
    //res.sendfile('./downloadpage.html');
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    res.send('hello world');
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