/**
 * New node file
 */
var mysql=require('mysql');
var connection=mysql.createConnection({
	user:'root',
	password:'password',
	database:'test'
});
var strSQL='select * from wzztest';
var query=connection.query(strSQL,function(err,results,fields)
{
	console.log('------result-------');
	console.log(results);
	console.log('------fields-------');
	console.log(fields);
}
);