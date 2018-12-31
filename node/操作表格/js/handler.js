const fs = require("fs");

// 初始化页面
function render(pathname, postData, res) {
  console.log("初始化页面","\n");
  if (pathname === "/") pathname = "../index.html";

  // 读取index.html
  fs.readFile(pathname, (err, data) => {
    if (err) throw new Error(err);
    response(res, data, "html");
  });
}

function read(pathname, postData, res) {
  let text = "";
  if (/css$/.test(pathname)) {
    pathname = ".." + pathname;
    text = "css";
    console.log("加载CSS文件：", pathname, "\n");
  } else if (/js$/.test(pathname)) {
    pathname = pathname.replace(/^\/js/, "");
    pathname = "." + pathname;
    text = "javascript";
    console.log("加载JS文件：", pathname, "\n");
  }

  const data = fs.readFileSync(pathname);
  response(res, data, text);
}
// 初始化表格
function init(pathname, postData, res) {
  console.log("初始化表格");
  console.log("开始读取表格源数据");

  fs.readFile("../sql/data.json", (err, data) => {
    if (err) throw new Error(err);
    console.log(data);
    console.log("开始渲染表格", "\n");
    response(res, JSON.stringify(JSON.parse(data)), "html");
  });
}
// 添加数据
// function go(postData, res) {
//   console.log("开始写入数据");
//   console.log(postData);

//   typeIn("../sql/data.json", postData);
//   // 检测数据类型
//   // console.log("数据类型：" + typeof data);
//   // console.log("我是后边");  检测异步执行

//   // 此时的postData因为同步操作，已经添加了id值
//   console.log("返回请求");

//   response(res, JSON.stringify(postData));
// }
// 保存数据
function save(pathname,postData,res) {
  console.log("开始写入数据");
  console.log(postData);
  // typeIn("../sql/data.json",postData);
  write("../sql/data.json", postData);
}
// ----------------------方法封装--------------------------------
// localhost/test，测试服务器是否配置成功
function test(postData, res) {
  response(res, "恭喜，测试成功！");
}
//------弃用数据写入逻辑------
// 将数据写入data.json
// function typeIn(fd, postData) {
//   // console.log("我是前边"); 检测异步执行
//   // 改为同步执行，因为要获取postData修改后的id
//   console.log("读取源数据");
//   // 同步读取数据
//   let data = fs.readFileSync(fd);
//   data = JSON.parse(data);
//   postData.id = ++data.length;
//   data.list[data.length - 1] = postData;

//   console.log("写入post数据到源数据");

//   write(fd, JSON.stringify(data));

//   // 异步执行，不能获取添加id后的postData
//   // fs.readFile(fd, (err, data) => {
//   //   if (err) throw new Error(err);
//   //   // console.log("我是里边"); 检测异步执行

//   //   data = JSON.parse(data); // 解析json
//   //   // 将数据添加到json中
//   //   postData.id = ++data.length;
//   //   data.list[data.length - 1] = postData;
//   //   // 将新数据写入json
//   //   write(fd, JSON.stringify(data));
//   // });
// }
// 数据写入方法
function write(fd, data) {
  fs.writeFile(fd, data, err => {
    console.log("数据类型：" + typeof data);

    if (err) throw new Error(err);
    console.log("数据写入成功", "\n");
  });
}
// 返回请求
function response(res, data, text) {
  res.setHeader("content-type", `text/${text};charset=utf8`);
  res.write(data);
  res.end();
}

module.exports.render = render;
module.exports.init = init;
// module.exports.go = go;
module.exports.test = test;
module.exports.save = save;
module.exports.read = read;