
/*public目录：存放静态文件。

routes目录：存放路由文件。

views目录： 存放页面文件。

common目录：存放公共文件
*/
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require("mongoose");
var session = require('express-session');

var bodyParser = require('body-parser');//这个中间件是用来获取ajax  post传来的数据可以req.body这样去获取
// 使用globa来定义全局变量dbHelper，dbHelper可以在任何模块内调用
global.dbHandle = require( './common/dbHandle' );
global.db = mongoose.connect("mongodb://127.0.0.1:27017/testreactnote");
db.connection.on("error", function (error) {
	    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
	    console.log("------数据库连接成功！------");
});

app.use(session({
    secret:'secret',
    cookie:{
        maxAge:1000*60*30
    }
}));

// 设定静态文件目录，比如本地文件
app.use(express.static(path.join(__dirname, 'public')));
// 设定views变量，意为视图存放的目录
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 使用engine函数注册模板引擎并指定处理后缀名为html的文件。
app.set('view engine','html');
// // 使用ejs模板
app.engine( '.html', require( 'ejs' ).__express );

// 加入路由
require('./routes')(app);


app.get('/', function (req, res) {  
   res.render('index');
});

app.listen(3000);