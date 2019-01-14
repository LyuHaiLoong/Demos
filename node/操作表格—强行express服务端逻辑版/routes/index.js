// 初始化页面
var express = require('express');
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get('/', function (req, res, next) {
  // req.app获取app.js内定义的全局app,，并通过app.get获取app.set添加的数据路径dataPath
  res.data = JSON.parse(fs.readFileSync(req.app.get("dataPath")));
  // 初始化页面时，挂载页面中的所有内容
  res.app.locals.data = res.data;
  res.app.locals.checked = checked(res.data);
  res.app.locals.unchecked = unchecked(res.data);
  res.app.locals.renderStatic = ["上移", "下移", "删除"]; // 全局渲染参数，用于模板渲染

  // 渲染模板，有callback时
  res.render("tbody", function (err, data) {
    if (err) console.log(err);
    res.render('index', {
      title: "Express 练习",
      data: data
    });
  });
});

function checked(data) {
  const result = JSON.parse(JSON.stringify(data));

  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      if (result[key] instanceof Array) {
        for (let i = result[key].length - 1; i >= 0; i--) {
          if (!+result[key][i].checked) {
            result[key].splice(i, 1);
          }
        }
      }
    }
  }

  return result;
}

function unchecked(data) {
  const result = JSON.parse(JSON.stringify(data));

  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      if (result[key] instanceof Array) {
        for (let i = result[key].length - 1; i >= 0; i--) {
          if (+result[key][i].checked) {
            result[key].splice(i, 1)
          };
        }
      }
    }
  }

  return result;
}

module.exports = router;

// ---------------------------
// ------可添加未实现功能------
// ---------------------------
// 1、发送数据通过zlib压缩
// ---------------------------
// ----------核心逻辑----------
// ---------------------------
// 引用数据为指针引用，修改被所有引用指针的数据共享
// ---------------------------
// ----------主要逻辑----------
// ---------------------------
// 1、根据状态码，渲染模板，返回渲染后的模板数据
// 2、根据不同功能，对数据执行排序、添加、删除操作
// 3、app.locals.data作为全部数据被全局共享
// 4、app.locals.checked作为已选数据被全局共享
// 5、app.locals.unchecked作为未选数据被全局共享
// 6、res.locals作为当次请求的渲染数据，在需要分状态渲染时，赋值
// ---------------------------
// ----------文件关系--------
// ---------------------------
// 1、super.js作为全局公共属性，可被其他所有功能require。所有方法都限制数据类型为数据形式
// 2、add.js——添加
// 3、check.js——单选与全选
// 4、del.js——批量删除与清空
// 5、order.js——上移、下移、删除
// 6、save.js——保存
// 7、shown.js——已选、未选、全部的显示切换
// 8、sort.js——排序
// 9、index.js——运行程序
// ---------------------------
// ----------需要强调的属性--------
// ---------------------------
// 1、app.locals——添加全局共享的属性到app。通过app.locals添加的属性，可以通过res/req.app.locals访问在res.render时，render会先查找res.locals在查找app。locals中是否存在渲染需要的数据
// 2、res.locals——当次请求的数据，只在当次请求中有效，被res.render调用
// 3、req.params——与路由中的匹配值对应，可以是正则匹配项，也可以是router.param添加的路由
// 4、res.render——ejs模板中的数据，可以通过render添加，如果render中没有添加，会根据数据名称查找res.locals以及app.locals有没有对应的属性存在
// ---------------------------
// ----------垃圾场----------
// ---------------------------
// 作为废弃思路及方法被保存，某些思路感觉其实还说得过去……不做注释