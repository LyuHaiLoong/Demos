const express = require("express");
const router = express.Router();
const fs = require("fs");
// 将全部数据写入到本地文件
router.get("/", function (req, res, next) {
  const data = res.app.locals.data
  // req.app.get获取app.set方法添加的属性
  fs.writeFile(req.app.get("dataPath"), JSON.stringify(data), function (err) {
    if (err) throw new Error(err);

    res.send("success");
  });
});

module.exports = router;

// 垃圾场

// router.post("/", function (req, res, next) {
//   let post = "";
//   req.on("data", function (chunk) {
//     post += chunk;
//   });
//   req.on("end", function () {
//     fs.writeFile(req.app.get("dataPath"), post, function (err) {
//       if (err) throw new Error(err);
//       res.send("success");
//       console.log("数据写入成功");
//     });
//   });
// });