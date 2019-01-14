const express = require("express");
const router = express.Router();
// 根据状态码渲染数据
// 状态码：0——全部、1——已选、2——未选
router.get(/\/(\d)/, function (req, res, next) {
  // 如果状态码是1或2，给局部数据data赋值
  // 否则直接查找全局的data数据
  if (req.params[0] == 1) {
    res.locals.data = res.app.locals.checked;
  } else if (req.params[0] == 2) {
    res.locals.data = res.app.locals.unchecked;
  }

  res.render("tbody");
});

// 垃圾场
// router.post(/\/[a-z]+(\d)(.+)/, function (req, res, next) {
//   res.locals.data = "";
//   req.on("data", function (chunk) {
//     res.locals.data += chunk;
//   });
//   req.on("end", function (err) {
//     if (err) throw new Error(err);
//     res.locals.data = JSON.parse(res.locals.data);

//     const shown = new Shown(res.app.locals.data.list, res.app.locals.checked.list, res.app.locals.unchecked.list, res.locals.data.list, res, "tbody", renderData);

//     shown[req.params[1]](req.params[0]);
//   });
// });

module.exports = router;