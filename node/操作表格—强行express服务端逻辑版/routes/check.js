const express = require("express");
const router = express.Router();
const Funcs = require("./super");

// 继承公共方法，添加私有方法
class Check extends Funcs {
  // 清空数据，用于全选
  clearData(data) {
    if (!(data instanceof Array)) {
      this.error("Array");
    }
    // 由于是引用类型数据共享，所以不能改变直接，清空通过删除长度来完成
    data.length = 0;
  }
  // 替换数据，用于全选
  replaceData(data, target) {
    if (!(data instanceof Array) || !(target instanceof Array)) {
      this.error("Array");
    }
    // 由于是引用类型数据共享，所以不能改变直接，替换通过删除长度来然后再填充来完成
    target.length = 0;
    target.push(...data);
  }
}
// 实例化对象
const funcs = new Check();
// 定义方法，将状态码作为key值，进行匹配
const funcAll = {
  // 取消全部选择时
  0: function (all, checked, unchecked) {
    // 改变所有数据的选中状态为未选
    funcs.changeValue(all, "checked", 0);
    // 清空已选数据
    funcs.clearData(checked);
    // 替换未选数据为全部数据
    funcs.replaceData(all, unchecked);
  },
  // 全部选择时
  1: function (all, checked, unchecked) {
    // 改变所有数据的选中状态
    funcs.changeValue(all, "checked", 1);
    // 清空未选数据
    funcs.clearData(unchecked);
    // 替换已选数据为全部数据
    funcs.replaceData(all, checked);
  }
}
const funcOne = {
  // 取消全部选择时
  0: function (postData, all, checked, unchecked) {
    // 切换全部数据中对应项的选中状态
    funcs.toggleBoolean(all, "checked", postData, "id");
    // 删除已选项数据的对应项
    funcs.delData(postData, checked, "id");
    // 添加对应项到未选数据
    funcs.pushData(postData, unchecked);
  },
  // 全部选择时
  1: function (postData, all, checked, unchecked) {
    // 切换全部数据中对应项的选中状态
    funcs.toggleBoolean(all, "checked", postData, "id");
    // 删除未选项数据的对应项
    funcs.delData(postData, unchecked, "id");
    // 添加对应项到已选数据
    funcs.pushData(postData, checked);
    // 已选数据与全选数据是否相等
    const flag = funcs.isEqual(checked, all, "id", 1);
    // 返回判断结果，用于前台执行全选添加选中状态的操作
    return flag.result.equal;
  }
}
// 全部选择时
// 状态码：0——取消全部选中状态；1——添加全部选中状态
router.get(/\/all(\d+?)/, function (req, res, next) {
  // 获取全局数据
  const all = req.app.locals.data.list,
    checked = req.app.locals.checked.list,
    unchecked = req.app.locals.unchecked.list;
  // 匹配状态码对应操作
  funcAll[req.params[0]](all, checked, unchecked);
  // 发送响应码
  res.sendStatus(200);
});
// 单选
// 状态码：0——取消选中状态；1——添加选中状态
router.post(/\/one(\d+?)/, function (req, res, next) {
  // 获取发送的数据
  let post = "";
  req.on("data", function (chunk) {
    post += chunk;
  });
  req.on("end", function (err) {
    if (err) throw new Error(err);
    // 对象化
    post = JSON.parse(post).list;

    const all = req.app.locals.data.list,
      checked = req.app.locals.checked.list,
      unchecked = req.app.locals.unchecked.list;
    // 返回结果
    let result = 0;
    // 根据状态码判断，如果是添加选中，判断result结果
    if (+req.params[0]) {
      result = funcOne[req.params[0]](post, all, checked, unchecked);
    } else {
      funcOne[req.params[0]](post, all, checked, unchecked);
    }

    res.send(result + ""); // 不能发送数字，会被当做响应状态码
  });
});



module.exports = router;