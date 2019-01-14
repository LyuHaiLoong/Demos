const createError = require('http-errors'); // 错误捕捉，可根据错误参数创建错误
const express = require('express'); // express
const path = require('path'); // node自带路径解析模块
const cookieParser = require('cookie-parser'); // cookie格式化
const logger = require('morgan'); // 请求信息打印，通过输入参数，切换输出模式

// 路由引入
const indexRouter = require('./routes/index'); //初始页面
const addRouter = require("./routes/add"); // 添加
const saveRouter = require("./routes/save"); // 保存
const delRouter = require("./routes/del"); // 删除
const sortRouter = require("./routes/sort"); // 排序
const shownRouter = require("./routes/shown"); // 已选、未选、全部显示
const checkRouter = require("./routes/check"); // 单选、全选
const orderRouter = require("./routes/order"); // 上移、下移、删除
const app = express(); // 启用express

// view engine setup
app.set('views', path.join(__dirname, 'views')); // 初始化模板路径，__dirname为node全局参数，获取当前文件所在的文件夹路径；path.join合并路径，并根据操作系统，自动添加路径分隔符
app.set('view engine', 'ejs'); // 初始化模板类型，ejs
// data setup
app.set("dataPath", path.join(__dirname, "sql", "data.json")); // 挂载数据文件路径

app.use(logger("dev")); // 开发模式输出，内容较为详细
// app.use(express.json()); // 解析json数据，添加到req.body上，中间件——body-parser，只能解析标准格式的数据如——a=b&c=d
app.use(express.urlencoded({
  extended: false // 使用node封装的querystring解析键值对数据，中间件——body-parser
}));
app.use(cookieParser()); // cookie格式化
app.use(express.static(path.join(__dirname, 'public'))); // 添加静态资源路径，可用于html文件中的link，src等内部请求。亦可以请求静态资源——本意为请求静态资源，但是模板输入情况下，用于请求模板内的CSS、JS、img等。原生node则需要在请求中定义路由，将所有CSS、JS、img等请求一遍

// 中间件的添加，如果匹配不到添加的所有路径触发器，会进error
// 但是如果直接添加function，就不会按顺序查找，永远都只进/根路径
app.use('/', indexRouter); // 输出默认页
app.use("/add", addRouter); // 添加
app.use("/save", saveRouter); // 保存
app.use("/del", delRouter); // 删除
app.use("/sort", sortRouter); // 排序
app.use("/shown", shownRouter); // 切换显示状态
app.use("/check", checkRouter); // 单选与全选
app.use("/order", orderRouter); // 上移、下移、删除
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404)); // 创建错误类型，并作为参数传递给next，next会寻找能匹配到的function中带有err参数的中间件
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message; // locals挂载本次响应的全局属性，render时可以直接获取。也可以在render时传入。挂载在res上的locals只在本次响应中有效
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // req.app.locals.env的值，不知道哪里加上的。等于development

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;