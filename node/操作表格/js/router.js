const handler = require("./handler");

// 分配路由操作
const todo = {}
todo["/"] = handler.render;
// todo["/data"] = handler.go;
todo["/test"] = handler.test;
todo["/init"] = handler.init;
todo["/save"] = handler.save;
todo["/read"] = handler.read;

function router(pathname, postData, res) {
  console.log("路由分配成功，开始执行操作");

  if (/(js|css)$/.test(pathname)) todo["/read"](pathname, postData, res);
  else if (typeof todo[pathname] === "function") todo[pathname](pathname, postData, res);
  else throw new Error("Invalid router");
}

module.exports.router = router;