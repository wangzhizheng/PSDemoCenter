function runpython(){
    var exec=require('child_process').exec;
    var arg1="hello";
    var arg2="wangzz";
    exec('python public/test.py ' + arg1 + ' ' + arg2,function(err,stdout,stderr){
        if (stdout.length>1) $("#result").html(stdout);
        else console.log('you don not offer args: ');
        if (err) console.info('stderr: '+stderr);
    });
}
