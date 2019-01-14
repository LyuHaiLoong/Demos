const express = require("express");
const router = express.Router();

// post获取post请求，匹配状态码
// 根据状态码确认要渲染的页面
// 状态码0-全部、1-已选、2-未选
router.post(/\/(\d)/, function (req, res, next) {
  // 获取本次请求的数据
  res.locals.data = "";
  req.on("data", function (chunk) {
    res.locals.data += chunk;
  });
  req.on("end", function () {
    // render参数——模板路径，数据，callback。没有callback时，渲染后的数据会作为响应返回；有callback时，渲染后的数据作为参数传递给callback
    // 数据对象化
    res.locals.data = JSON.parse(res.locals.data);
    // 获取全局数据
    const dataAll = res.app.locals.data.list,
      dataChecked = res.app.locals.checked.list,
      dataUnchecked = res.app.locals.unchecked.list,
      flag = req.params[0];

    // 添加到全局data
    dataAll.push(res.locals.data);
    // 再根据选中状态，添加到相应的数据中
    if (+res.locals.data.checked) {
      dataChecked.push(res.locals.data);
    } else {
      dataUnchecked.push(res.locals.data);
    }
    // 根据状态码确认渲染数据
    if (flag == 0) res.locals.data = res.app.locals.data;
    else if (flag == 1) res.locals.data = res.app.locals.checked;
    else res.locals.data = res.app.locals.unchecked;
    // 渲染，参数直接找res.locals.data
    res.render("tbody");
  });
});

module.exports = router;