const express = require("express");
const router = express.Router();

// 根据状态码，定义方法对象，进行状态码匹配
const func = {
  0(res) {
    res.locals.data = res.app.locals.data;
  },
  1(res) {
    res.locals.data = res.app.locals.checked;
  },
  2(res) {
    res.locals.data = res.app.locals.unchecked;
  }
}
// 批量删除
router.post(/\/(\d)/, function (req, res, next) {
  // 获取局部请求数据
  res.locals.data = "";
  req.on("data", function (chunk) {
    res.locals.data += chunk;
  });
  req.on("end", function () {
    // 对象化
    res.locals.data = JSON.parse(res.locals.data);
    // 获取全局数据,不需要对未选数据进行操作
    const dataLocals = res.locals.data.list,
      dataAll = res.app.locals.data.list,
      dataChecked = res.app.locals.checked.list;

    // 修改全局数据，因为删除的肯定为选中项，所以不需要对未选数据执行操作
    delData(dataLocals, dataAll, "id");
    delData(dataLocals, dataChecked, "id");
    // 根据状态码，确定渲染数据
    func[req.params[0]](res);
    // 渲染
    res.render("tbody");
  });
});
// 删除全部
router.get("/all", function (req, res, next) {
  // 获取全局数据
  const dataAll = res.app.locals.data.list,
    dataChecked = res.app.locals.checked.list,
    dataUnchecked = res.app.locals.unchecked.list
  // 清空全局数据
  dataAll.length = 0;
  dataChecked.length = 0;
  dataUnchecked.length = 0;

  res.sendStatus(200);
});

// 删除目标项
// 数据类型[{}]
function delData(data, target, key) {
  if (!(data instanceof Array) || !(target instanceof Array)) {
    throw new Error("Invalid Paramters: The parameters must be Array");
  }
  // data没长度，就不用删除
  if (!data.length) return;
  // 对比两组数据中对象key值是否相等，查找相等项，删除相等项
  for (const i of data) {
    if (typeof i !== "object") {
      throw new Error("Invalid Paramters: The parameters must be Array");
    }
    for (let j = target.length - 1; j >= 0; j--) {
      if (typeof target[j] !== "object") {
        throw new Error("Invalid Paramters: The parameters must be Object");
      }
      if (i.hasOwnProperty(key) && target[j].hasOwnProperty(key)) {
        if (i[key] === target[j][key]) {
          target.splice(j, 1);
        }
      }
    }
  }
}

module.exports = router