const express = require('express');
const router = express.Router();
const Funcs = require("./super");

// 实例化公共方法
const funcs = new Funcs();
// 添加私有方法
// 根据key值，对调数据位置
// 因为只支持两项数据对调，所以直接根据data[0]、data[1]判断并赋值
// 垃圾场内有另一种废弃方法们也可以看看
funcs.exchangeKey = function (data, target, key) {
  // data与target必须为数组
  // data的长度必须为2
  if (!(data instanceof Array) || !(data instanceof Array)) this.error("Array");
  if (data.length !== 2) throw new Error("The target to exchange must be 2");

  // count计数，匹配到data时，count++，如果count不等于2，说明数据调换失败
  let count = 0;

  for (let i = 0; i < target.length; i++) {
    if (target[i][key] === data[0][key]) {
      target[i] = data[1];
      count++;
    } else if (target[i][key] === data[1][key]) {
      target[i] = data[0];
      count++;
    }
  }
  // 匹配失败，抛出错误
  if (count !== 2) throw new Error("Exchange Failure");
};
// 创建方法匹配状态码的对象
const order = {
  // 上移
  0: function (data, target, key) {
    funcs.exchangeKey(data, target, key);
  },
  // 下移
  1: function (data, target, key) {
    funcs.exchangeKey(data, target, key);
  },
  // 删除
  2: function (data, target, key) {
    funcs.delData(data, target, key);
  }
}

// post0对应要对调位置的数据
// post1对应当前页面内的数据
// flag状态码为0——上移、1——下移、2——删除
router.post(/\/(\d)/, function (req, res, next) {
  // 获取发送的数据
  let post = "";
  req.on("data", function (chunk) {
    post += chunk;
  });
  req.on("end", function (err) {
    if (err) throw new Error(err);
    // 获取全局数据
    const dataAll = res.app.locals.data.list,
      dataChecked = res.app.locals.checked.list,
      dataUnchecked = res.app.locals.unchecked.list,
      // flag为状态码
      flag = req.params[0];
    post = JSON.parse(post);
    // 获取对应的数据
    const post0 = post[0].list,
      post1 = post[1].list;
    // 上移与下移操作可以只写一个，然后匹配对象，但是考虑毕竟是两个操作，所以分开了
    // 上移操作
    // 不管执行上移、下移、还是删除，都要对全部数据执行操作
    // 其中上移与下移，都要对当前页面显示的数据执行操作，因为最后的渲染根据当前页面数据执行渲染。不这样的话，在显示状态为已选或未选时，再次渲染将只能渲染已选或未选数据，当前页面将无法渲染。所以发送的数据中包含了当前页面的数据
    if (flag == 0) {
      // 操作全部数据及当前页面数据
      order[flag](post0, dataAll, "id");
      funcs.exchangeKey(post0, post1, "id");
      // 如果位置调换的数据都为已选或都为未选，那么在全选与未选数据中的位置，也进行对换
      // 因为发送的数据都为字符串，所以通过+转换为数字，进行checked判断
      if (+post0[0].checked === +post0[1].checked) {
        if (+post0[0].checked && +post0[1].checked) {
          // 对调已选数据中的位置
          funcs.exchangeKey(post0, dataChecked, "id");
        } else if (!+post0[0].checked && !+post0[1].checked) {
          // 对换未选数据中的位置
          funcs.exchangeKey(post0, dataUnchecked, "id");
        }
      }
      // 渲染数据为当前页面数据
      res.locals.data = post[1];
    }
    // 下移操作，逻辑同上移数据
    else if (flag == 1) {
      order[flag](post0, dataAll, "id");
      funcs.exchangeKey(post0, post1, "id");
      if (+post0[0].checked === +post0[1].checked) {
        if (+post0[0].checked && +post0[1].checked) {
          funcs.exchangeKey(post0, dataChecked, "id");
        } else if (!+post0[0].checked && !+post0[1].checked) {
          funcs.exchangeKey(post0, dataUnchecked, "id");
        }
      }

      res.locals.data = post[1];
    }
    // 删除数据
    else if (flag == 2) {
      // 不管删除那一项，全部数据中都要删除对应项
      funcs.delData(post0, dataAll, "id");
      // 然后根据删除项是否被选中，在相应数据组里删除对应项
      if (+post0[0].checked) {
        order[flag](post0, dataChecked, "id");
      } else {
        order[flag](post0, dataUnchecked, "id");
      }
      // 最后判断，当前显示页不是全选页，就将渲染数据替换为已经被更改后的当前页数据
      // 只有全选页或者全部已选、全部未选时，发送的数据长度才和全选数据长度相等，此时只要渲染全部数据就行
      // 否则就需要将渲染数据替换为相应的数据进行渲染
      if (post1.length !== dataAll.length + 1) {
        order[flag](post0, post1, "id");
        res.locals.data = post[1];
      }
    }

    res.render("tbody");
  });
});

module.exports = router;

// 垃圾场，替换逻辑可看
// funcs.exchangeKey = function (value, data, key) {
//   if (!(value instanceof Array) || !(data instanceof Array)) this.error("Array");
//   if (value.length !== 2) throw new Error("The target to exchange must be 2");

//   let i = -1;
//   const len = data.len;

//   for (let j = 0; j < len; j++) {
//     if (value.includes(data[j][key])) {
//       if (data[len] === undefined) {
//         data[len] = data[j];
//         i = j;
//       } else {
//         [data[i], data[j]] = [data[j], data[len]];
//         data--;
//       }
//     }
//   }

//   if (i === -1) throw new Error("No result");
// };