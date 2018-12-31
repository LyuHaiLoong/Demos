const http = require("http");
const {
  parse: urlParse
} = require("url");
const route = require("./router");
// const {
//   parse: queryParse
// } = require("querystring");
// 创建服务器
function start() {
  const onRequest = function (req, res) {
    console.log("数据请求开始");

    // 服务url路径
    const pathname = urlParse(req.url).pathname;
    
    console.log(pathname);
    if (pathname === "/favicon.ico") return; // node默认请求，每次都执行
    // 读取post信息
    let postData = "";
    req.on("data", (chunk) => {
      console.log("数据传送中");
      console.log("传送数据", chunk);
      postData += chunk;
    });
    // 将post信息及路径传给路由解析
    req.on("end", () => {
      console.log("数据传送结束，开始分配路由");
      // // post信息对象化
      // postData = queryParse(postData);
      
      route.router(pathname, postData, res);
    });
  };

  http.createServer(onRequest).listen(80);
}

module.exports.start = start;