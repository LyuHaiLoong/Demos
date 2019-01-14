const create = require("http-errors");
const express = require("express");
const app = express();
const child_process = require("child_process");
const router = express.Router();
const bodyParser = require("body-parser");
const util = require("util");
const cookies = require("cookie-parser");
const path = require("path");
const logger = require("morgan");

// app.use(express.static(path.join(__dirname, "public")));
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
// var indexRouter = require('./routes/index'); // 初始页面

// app.use(logger("dev"));

// app.use("/", indexRouter);


// app.get("/test", function () {
//   console.log(2);
// });
// app.get(function (req, res, next) {
//   next(create(404));
// });
// app.get(function (err, req, res, next) {
//   res.send(err.stack);
// });


// app.get(function (req, res, next) {
//   console.log(process.env);
//   process.env.NODE_ENV = "dev";
//   console.log(process.env.NODE_ENV);
// });

// app.get(function (req, res, next) {
//   console.log(1);
//   next("<p>aaaa</p>", {
//     "content-type": "text/html;charset=utf8"
//   });
//   res.send("<p>aaaa</p>");
// });

app.get("/test", function (req, res, next) {
  console.log(1);
  next();
});
app.get("/",function (req, res, next) {
  // console.log(err);
  console.log(2);
})
app.get("/app", function () {
  console.log(3);
});

app.get("/test", function (req, res) {
  console.log(4);

})
app.get("/t", function (req, res, next) {
  console.log(5);
})
app.listen(80);



// var createError = require('http-errors'); // 错误捕捉
// var express = require('express'); // express
// var path = require('path'); // node自带路径解析模块
// var cookieParser = require('cookie-parser'); // cookie格式化
// var logger = require('morgan'); // 请求信息打印

// var indexRouter = require('./routes/index'); // 初始页面
// var usersRouter = require('./routes/users'); // 测试页面

// var app = express(); // 启用express

// // view engine setup
// app.set('views', path.join(__dirname, 'views')); // 初始化模板路径
// app.set('view engine', 'ejs'); // 初始化模板类型

// app.use(logger("dev")); // 开发模式输出，内容较为详细
// app.use(express.json()); // 解析json数据，添加到req.body上，中间件——body-parser
// app.use(express.urlencoded({
//   extended: false // 使用node封装的querystring解析键值对数据，中间件——body-parser
// }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public'))); // 添加静态资源路径，可用于html文件中的link，src等内部请求。亦可以请求静态资源——本意为请求静态资源，但是模板输入情况下，用于请求模板内的CSS、JS、img等

// app.use('/', indexRouter); // 输出默认页
// app.use('/users', usersRouter); // 输出测试页

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404)); // 创建错误类型，并作为参数传递给next，next会寻找能匹配到的function中带有err参数的中间件
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message; // locals挂载本次响应的全局属性
//   res.locals.error = req.app.get('env') === 'development' ? err : {}; // req.app.locals.env的值，不知道哪里加上的。等于development

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// app.listen(80);
// module.exports = app;