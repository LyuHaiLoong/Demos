// 封装方法类，用于数据判断及渲染
class Func {
  // 封装公共方法，数据渲染，没啥用……
  render(res, fs, data) {
    res.render(fs, data);
  }

  // 改变选中数据的Boolean状态
  // a为想要匹配的数据项
  // b为想要更改的数据项
  // change为b中想要更改的数据项
  // key为用于两组数据匹配的唯一数据项
  // 如果b与key输入值,如果b也是数组,进行两组数据的比对更改,更改a[key] === b[key]的重复项;如果b不是数组,匹配a[key] === b的项
  // 如果b与key未输入,就改变a中的change项
  // 支持数据类型[{}]
  toggleBoolean(a, change, b, key) {
    // a不是数组就抛出错误
    if (!(a instanceof Array)) {
      this.error("Array");
    }
    // 如果b输入值
    if (b !== undefined) {
      // 如果b是数组,循环b
      if (b instanceof Array) {
        // b中的项不是对象，就报错
        for (const i of b) {
          if (typeof i !== "object") {
            this.error("Object");
          }
          // 循环a
          for (const j of a) {
            // b中的项不是对象，就报错
            if (typeof j !== "object") {
              this.error("Object");
            }
            // 匹配相等值，执行操作
            if (i.hasOwnProperty(key) && j.hasOwnProperty(key)) {
              if (i[key] === j[key]) {
                j[change] = +!(+j[change]);
              }
            }
          }
        }
      }
      // 如果b不是数组
      else {
        // 循环a
        for (const i of a) {
          if (typeof i !== "object") {
            this.error("Object");
          }
          // 找到匹配项，执行操作
          if (i[key] === b) {
            i[change] = +!(+i[change]);
          }
        }
      }
    }
    // 如果b没有值，循环a改变a[change]
    else {
      for (const i of a) {
        if (typeof i !== "object") {
          this.error("Object");
        }
        i[change] = +!(+i[change]);
      }
    }
  }
  // 改变数组a中的对象key为val
  // 支持数据类型[{}]
  changeValue(a, key, val) {
    // 不是数组就抛出错误
    if (!(a instanceof Array)) {
      this.error("Array");
    }
    // 循环a，更改对应值
    for (const i of a) {
      if (typeof i !== "object") {
        this.error("Object");
      }
      if (i[key] !== val) i[key] = val;
    }
  }
  // 添加数据
  // 数据类型必须一致
  // 只支持数据类型[{}]
  // data为要添加的数组
  // target为要添加数据的目标
  pushData(data, target) {
    if (!(data instanceof Array) || !(target instanceof Array)) {
      this.error("Array");
    }
    // 如果data为空，返回
    if (!data.length) return;
    target.push(...data);
  }
  // 删除目标项
  // 根据key值匹配data与target中的重复项，进行删除
  // data为需要匹配的数据，如果data是数组执行两个数组的key值匹配；如果data不是数组，匹配target中key值等于data的项
  // target为执行删除操作的数据
  // key为唯一的匹配属性值
  // 只支持数据类型[{}]
  delData(data, target, key) {
    // target不是数组就抛出错误
    if (!(target instanceof Array)) {
      this.error("Array");
    }
    // 如果data是数组，进行data与target中的key值匹配
    if (data instanceof Array) {
      // data为空，不执行操作
      if (!data.length) return;

      for (const i of data) {
        // 数组中的项不是对象，抛出错误
        if (typeof i !== "object") {
          this.error("Object");
        }
        // 倒循环，执行删除操作
        for (let j = target.length - 1; j >= 0; j--) {
          if (typeof target[j] !== "object") {
            this.error("Object");
          }
          if (i.hasOwnProperty(key) && target[j].hasOwnProperty(key)) {
            if (i[key] === target[j][key]) {
              target.splice(j, 1);
            }
          }
        }
      }
    }
    // 如果data不是数组，匹配target中key值等于data的项，进行删除
    else {
      for (let i = target.length - 1; i >= 0; i--) {
        if (typeof target[i] !== "object") {
          this.error("Object");
        }
        if (target[i].hasOwnProperty(key)) {
          if (target[i][key] === data) {
            target.splice(i, 1);
          }
        }
      }
    }
  }
  // 判断数据是否相等，将不重复数据添加到b中，将重复数据添加到a中，并判断两个数据是否完全相等
  // a: 新数据
  // b: 旧数据
  // key: 用于判断对象相等的唯一key值
  // flag：作用结果是否改变源数据
  // 作用结果：
  //     ——a：两组数据中的所有不重复项，将赋值给a（包括b中有但a中没有，以及a中有但b中没有的对象）
  //     ——b：保留a与b的重复项，删除b中有但a中没有的项，添加a中有但b中没有的项
  //     ——返回值：对象，包含add、del及equal
  //            ——add：a中添加到b中不重复项
  //            ——del：b中删除的不重复项
  //            ——equal：两组数据是否完全相等
  // 关于作用结果：
  //     ——因为参数a、b均为引用数据，函数默认直接改变了源数据。
  //     ——增加了不改变源数据的判断，返回结果为更改后的数据a、b及result。但是返回结果最好还是根据需要修改
  isEqual(a, b, key, flag) {
    if (!(a instanceof Array) || !(b instanceof Array)) this.error("Array");

    // 不改变源数据，深拷贝重新赋值
    if (flag) {
      a = JSON.parse(JSON.stringify(a));
      b = JSON.parse(JSON.stringify(b));
    }
    // 返回结果
    let result = {
      add: [],
      del: [],
      equal: 1 // 默认为相等
    };
    // 特殊情况判断
    // 如果a是空数据，直接返回
    if (!a.length) {
      // 两组数据不相等
      result.equal = 0;
      // 如果未改变源数据，返回相应结果
      if (flag) {
        return {
          newA: a,
          newB: b,
          result: result
        };
      }

      return result;
    }
    // 如果b是空数据，直接填充
    if (!b.length) {
      b.push(...JSON.parse(JSON.stringify(a))); // 为了保证指针地址的不变，所有的赋值都采用push或者arr[index]的方式赋值
      result.add = b;
      result.equal = 0;

      if (flag) {
        return {
          newA: a,
          newB: b,
          result: result
        };
      }
      return result;
    }
    // 执行双循环
    // 定义个对象用于存放a中的key值与索引值
    // 第二次循环时，用于匹配b
    // 而对象中的索引值，又用于最后的赋值
    const obj = {}; // 存放a的索引
    let len = a.length; // 保存a的初试长度，用于最后的切割

    // 添加a的key值为obj的key，key值对应的属性值为索引
    for (let i = 0; i < a.length; i++) {
      obj[a[i][key]] = i;
    }
    // b去重
    for (let i = b.length - 1; i >= 0; i--) {
      if (obj[b[i][key]] === undefined) { // b中有但a中没有
        // 将b中的不重复项添加到a及result.del中，然后b中删除不重复项
        a.push(b[i]);
        result.del.push(b[i]);
        result.equal = 0;
        b.splice(i, 1);
      } else {
        // 删除重复项索引
        // obj对象中的剩余索引，用于最后一步赋值操作
        delete obj[b[i][key]];
      }
    }
    // a去重,并且将不重复项添加到b与result.add中
    // 获取obj中剩余的索引值，不为空则执行操作
    if (Object.values(obj).length) {
      const values = Object.values(obj);
      for (const i of values) {
        b.push(a[i]);
        // 将剩余值添加到a中的末尾，用于a最后的切割
        a.push(a[i]);
        result.add.push(a[i]);
        result.equal = 0;
      }
    }
    // 切割a,splice改变原数组
    // a中最后只保留两组数据中的相互不重复项
    a.splice(0, len);

    if (flag) {
      return {
        newA: a,
        newB: b,
        result: result
      }
    }
    return result;
  }
  // 报错控制
  error(errorType) {
    const error = {
      "Array": "Invalid Paramters: The parameters must be Array",
      "Object": "Invalid Paramters: The parameters must be Object",
      "Include": "The parameter 1 must include parameter 0"
    }
    throw new Error(error[errorType]);
  }
}

module.exports = Func;

// 垃圾场，废弃思路，加了个中间数据对比，感觉写的还行…… 因为点击选中会更新数据了，所以用不着了
// 状态函数
// 数据码0、1、2；包含状态码01、10、11；状态码最后一位0或1，对应发送的数据是已选项或是未选项
// 总共有：全选匹配001、101、201；已选匹配010、110、210；未选匹配011、111、211
// 状态码匹配函数，数据码作为状态码函数的参数，用于内部判断

// 全选状态下的点击发送，进行中间数据比对
// 发送已选数据，对比已选数据，执行后续操作
// a0(a) {
//   if (a == 1) {
//     let result = this.isEqual(this.postData, this.dataChecked, "id");

//     const resultData = result.add.concat(result.del);
//     if (resultData.length) {
//       this.toggleBoolean(this.dataAll, "checked", resultData, "id");
//       this.delData(result.add, this.dataUnchecked, "id");
//       this.toggleBoolean(result.del, "checked");
//       this.pushData(result.del, this.dataUnchecked);
//     }
//     this.postData.length = 0;
//     this.postData.push(...this.dataChecked);

//     this.render(this.res, this.fs, this.renderData);
//   } else {
//     return;
//   }
// }
// // 发送未选数据，对比未选数据，执行后续操作
// a1(a) {
//   if (a == 0) {
//     let result = this.isEqual(this.postData, this.dataUnchecked, "id");
//     const resultData = result.add.concat(result.del);
//     if (resultData.length) {
//       this.toggleBoolean(this.dataAll, "checked", resultData, "id");
//       this.delData(result.add, this.dataChecked, "id");
//       this.toggleBoolean(result.del, "checked");
//       this.pushData(result.del, this.dataChecked);
//     }

//     this.postData.length = 0;
//     this.postData.push(...this.dataAll);
//     this.render(this.res, this.fs, this.renderData);
//   }
//   if (a == 1) {
//     return;
//   }
//   if (a == 2) {
//     let result = this.isEqual(this.postData, this.dataUnchecked, "id");

//     const resultData = result.add.concat(result.del);
//     if (resultData.length) {
//       this.toggleBoolean(this.dataAll, "checked", resultData, "id");
//       this.delData(result.add, this.dataChecked, "id");
//       this.toggleBoolean(result.del, "checked");
//       this.pushData(result.del, this.dataChecked);
//     }

//     this.postData.length = 0;
//     this.postData.push(...this.dataUnchecked);
//     this.render(this.res, this.fs, this.renderData);
//   }
// }
// // 发送已选数据——未选删除;已选添加;比对全部数据，更改选中状态
// b0(a) {
//   this.delData(this.postData, this.dataUnchecked, "id");
//   this.toggleBoolean(this.dataAll, "checked", this.postData, "id");
//   this.pushData(this.postData, this.dataChecked);
//   if (a == 0) {
//     this.postData.length = 0;
//     this.postData.push(...this.dataAll);
//     this.render(this.res, this.fs, this.renderData);
//   }
//   if (a == 1) {
//     this.postData.length = 0;
//     this.postData.push(...this.dataChecked);
//     this.render(this.res, this.fs, this.renderData);
//   }
//   if (a == 2) {
//     this.postData.length = 0;
//     this.postData.push(...this.dataUnchecked);
//     this.render(this.res, this.fs, this.renderData);
//   }
// }
// // 发送未选数据——未选添加;已选删除;比对全部数据，更改选中状态
// b1(a) {
//   this.delData(this.postData, this.dataChecked, "id");
//   this.toggleBoolean(this.dataAll, "checked", this.postData, "id");
//   this.pushData(this.postData, this.dataUnchecked);
//   if (a == 0) {
//     this.postData.length = 0;
//     this.postData.push(...this.dataAll);
//     this.render(this.res, this.fs, this.renderData);
//   }
//   if (a == 1) {
//     this.postData.length = 0;
//     this.postData.push(...this.dataChecked);
//     this.render(this.res, this.fs, this.renderData);
//   }
//   if (a == 2) {
//     this.postData.length = 0;
//     this.postData.push(...this.dataUnchecked);
//     this.render(this.res, this.fs, this.renderData);
//   }
// }