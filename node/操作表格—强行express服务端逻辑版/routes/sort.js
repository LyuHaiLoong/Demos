const express = require("express");
const router = express.Router();
// 根据状态码匹配操作
// 状态码id、age、level对应id排序、年龄排序、职级排序
// 状态码sort为0或1，对应由大到小或是由小到大排序
const sort = {
  id(data, sort) {
    data.sort((a, b) => !!sort ? a.id - b.id : b.id - a.id); //
  },
  age(data, sort) {
    data.sort((a, b) => !!sort ? a.age - b.age : b.age - a.age);
  },
  level(data, sort) {
    data.sort((a, b) => !!sort ? a.level - b.level : b.level - a.level);
  }
}
// 状态码id、age、level对应排序类型
// 状态码0、1对应排序方式
// 状态码0、1、2对应渲染数据
router.get(/\/(.+)(\d)(\d)/, function (req, res, next) {
  // 获全局数据
  const dataAll = res.app.locals.data,
    dataChecked = res.app.locals.checked,
    dataUnchecked = res.app.locals.unchecked;
  // 匹配状态码操作
  sort[req.params[0]](dataAll.list, +req.params[2]);
  sort[req.params[0]](dataChecked.list, +req.params[2]);
  sort[req.params[0]](dataUnchecked.list, +req.params[2]);
  // 渲染状态码数据
  // 全选时更改渲染数据
  if (req.params[1] == 1) {
    res.locals.data = dataChecked;
  } else if (req.params[1] == 2) {
    res.locals.data = dataUnchecked;
  }

  res.render("tbody");
});

module.exports = router;

// 垃圾场
// const sort = {
//   id0(data) {
//     data.list.sort((a, b) => b.id - a.id);
//   },
//   id1(data) {
//     data.list.sort((a, b) => a.id - b.id);
//   },
//   age0(data) {
//     data.list.sort((a, b) => b.age - a.age);
//   },
//   age1(data) {
//     data.list.sort((a, b) => a.age - b.age);
//   },
//   level0(data) {
//     data.list.sort((a, b) => b.level - a.level);
//   },
//   level1(data) {
//     data.list.sort((a, b) => a.level - b.level);
//   }
// }

// // post和get是完全匹配，不接受只匹配其中一个字符，所以只能通过正则匹配
// router.post(/\/(.*)/, function (req, res, next) {
//   res.locals.data = "";
//   req.on("data", function (chunk) {
//     res.locals.data += chunk;
//   });
//   req.on("end", function (err) {
//     if (err) throw new Error(err);
//     res.locals.data = JSON.parse(res.locals.data);

//     if (sort[req.params[0]]) sort[req.params[0]](res.locals.data);

//     next(res.locals.data);
//   });
// });
// router.use(function (post, req, res, next) {
//   // render参数——模板路径，数据，callback。没有callback时，渲染后的数据会作为响应返回；有callback时，渲染后的数据作为参数传递给callback

//   res.render("tbody", {
//     data: post,
//     btn1: "上移",
//     btn2: "下移",
//     btn3: "删除"
//   });
// });

// function checked(data) {
//   const result = JSON.parse(JSON.stringify(data));

//   for (const key in result) {
//     if (result.hasOwnProperty(key)) {
//       if (result[key] instanceof Array) {
//         for (let i = result[key].length - 1; i >= 0; i--) {
//           if (!+result[key][i].checked) {
//             result[key].splice(i, 1);
//             result.length--;
//           }
//         }
//       }
//     }
//   }

//   return result;
// }

// function unchecked(data) {
//   const result = JSON.parse(JSON.stringify(data));

//   for (const key in result) {
//     if (result.hasOwnProperty(key)) {
//       if (result[key] instanceof Array) {
//         for (let i = result[key].length - 1; i >= 0; i--) {
//           if (+result[key][i].checked) {
//             result[key].splice(i, 1);
//             result.length--;
//           }
//         }
//       }
//     }
//   }

//   return result;
// }