// 公共属性及方法类，继承使用
class Table {
  constructor() {
    this.table = this.find("#table"); // table表格
    this.tbody = this.find("tbody", this.table)[0]; // 表格tbody
    this.td = this.find("td", this.tbody); // 所有的td
    this.sAll = this.find("#sAll", this.table); // 全选按钮
    this.showChecked = this.find("#checked"); // 已选按钮
    this.showUnchecked = this.find("#unchecked"); // 未选按钮
    this.showAll = this.find("#all"); // 全部按钮
    this.keys = ["checked", "id", "name", "age", "job", "level"]; // 向后端发送的数据是对象形式，keys代表对象的所有key值
    this.indexs = [0, 1, 2, 3, 4, 5]; // 与key值对应，同时对应tr下td的索引，取相应索引下的td的data-value
    this.tdLength = 7; // tr下的td的长度，用于逻辑运算
    this.tbody.status = this.showAll; // 表格当前的显示状态，初始化默认为显示全部
  }
  // find函数，用于寻找parent下的dom节点，parent默认为document
  // dom可以是tagName、id、class
  // 如果dom已经是DOM节点，直接返回结果
  find(dom, parent = document) { // dom为要查找的目标节点，target为目标节点的父节点,必须为确定的节点
    // 判断dom参数
    // isDOM判断是否已经为DOM节点
    // isDOM函数见下方详细解析
    if (this.isDOM(dom) === "DOM") return dom;
    // dom函数如果不是DOM节点，就必须为字符串，不支持其他参数类型
    if (this.isDOM(dom) !== "string") this.error("String");
    // 判断parent参数，逻辑同dom
    if (this.isDOM(parent) === "string") parent = this.find(parent);
    if (this.isDOM(parent) !== "DOM") this.error("DOM");
    // 通过nodeType判断，parent是否为一个确定的节点
    if (!parent.nodeType) this.error("nodeType");
    // 查找dom
    // 利用replace判断dom是tagName、id或class
    // $0、$1、$2粉笔对应匹配项的原字符串、第一个匹配值、第二个匹配值，这里对应为dom字符串、.或#、.或#后边的字符串
    dom.replace(/([.#]?)(.+)/, function ($0, $1, $2) {
      switch ($1) {
        case "#": // id查找，因为getElementById值支持document，所以改用querySelector
          dom = parent.querySelector($0);
          break;
        case ".": // class查找
          dom = parent.getElementsByClassName($2);
          break;
        default: // tagName查找
          dom = parent.getElementsByTagName($2);
      }
    });
    // 返回结果
    return dom;
  }
  // judge DOM，判断dom是否为DOM类型
  isDOM(dom) { // dom为需要判断的DOM节点
    // DOM查找到的节点类型分为四种——HTMLDocument、HTMLElement+标签名、HTMLCollection、NodeList
    // 对应的每种类型toString之后，分别显示[object(空格)+以上类型]的字符串
    // 利用这一特性，通过正则匹配的方式，判断dom类型
    // 如果是节点，返回DOM，否则返回相应的数据类型
    if (/^\[object (HTMLCollection|HTML.+(Element)?|NodeList)\]$/.test(dom.toString())) return "DOM";
    else return typeof dom;
  }
  // innerHTML，没有value时获取，有value时赋值
  // 获取目标节点下的innerHTML值，因为后期逻辑改动，弃用方法，但保留封装函数
  // 支持改变或者获取，单个或多个节点的innerHTML
  // 也可以通过输入数组形式的value，给多个节点赋值不一样的innerHTML
  // value也可以是DOM，那么将把value的innerHTML赋值给dom
  // 如果输入index，可以指定dom节点、value值或者innerHTML内容的索引。基本用不上
  innerHTML(dom, value = null, index) { // dom为DOM节点，可以为单节点或多节点，index为对应的节点、value值或字符串内容的索引
    // 判断dom节点
    if (this.isDOM(dom) === "string") dom = this.find(dom);
    if (this.isDOM(dom) !== "DOM") this.error("DOM");
    // 如果dom是单节点
    if (dom.nodeType) {
      // 如果输入value值，则赋值
      if (value !== null) {
        // 如果value是数组，判断是否赋值不同值
        // 因为dom是单节点，所以此时如果value是数组，那么必须输入index值
        // 所以没有对index进行判断，直接用index,否则arr[undefined] = undefined
        if (value instanceof Array) {
          dom.innerHTML = value[index];
        }
        // 如果value是DOM
        else if (this.isDOM(value) === "DOM") {
          // 如果value是单节点，直接调用index赋值
          if (value.nodeType) {
            value = value.innerHTML.trim();
            if (index !== undefined) {
              dom.innerHTML = value[index];
            } else {
              dom.innerHTML = value;
            }
          } else {
            value = value[index].innerHTML.trim();
            dom.innerHTML = value;
          }
        } else { // 如果是DOM及数组之外的其他类型，直接转换成字符串赋值
          value = value + "";
          if (inedx !== undefined) {
            dom.innerHTML = value[index];
          } else {
            dom.innerHTML = value;
          }
        }
      } else { // 如果没有value，返回去空格后innerHTML，这里可以将trim方法删除
        // 若果有index，返回index对应值
        return index ? dom.innerHTML.trim()[index] : dom.innerHTML.trim();
      }
    }
    // 如果dom是节点集合
    else {
      // 如果value不是null，赋值
      if (value !== null) {
        // 如果value是数组
        if (value instanceof Array) {
          // 如果index有值，根据index值赋值
          if (inedx !== undefined) {
            for (let i = 0; i < dom.length; i++) {
              dom[i].innerHTML = value[index];
            }
          }
          // 如果没有index，分别赋值
          else {
            for (let i = 0; i < dom.length; i++) {
              dom[i].innerHTML = value[i];
            }
          }
        }
        // 如果value是DOM
        else if (this.isDOM(value) === "DOM") {
          // 如果value是单节点，获取value的innerHTML
          if (value.nodeType) {
            value = value.innerHTML.trim();
            // 如果有index，获取对应的index项
            if (index !== undefined) {
              value = value[index];
            }
            // 给所有dom节点赋值
            for (const v of dom) {
              v.innerHTML = value;
            }
          }
          // 如果value是节点集合
          else {
            // 如果有index，获取对应index项的innerHTML，然后赋值
            if (index !== undefined) {
              value = value[index].innerHTML.trim();
              for (const v of dom) {
                v.innerHTML = value;
              }
            }
            // 如果没有index，一一对应赋值
            else {
              for (let i = 0; i < dom.length; i++) {
                dom[i].innerHTML = value[i].innerHTML.trim();
              }
            }
          }
        }
        // 其余数据类型，直接转换成字符串，然后赋值
        else {
          value = value + "";
          if (index !== undefined) {
            value = value[index];
          }
          for (const v of dom) {
            v.innerHTML = value;
          }
        }
      }
      // 如果没有value
      else {
        // 如果有index，返回dom中对应index项的innerHTML
        if (index !== undefined) return dom[index].innerHTML.trim();
        // 如果没有index，创建一个数组，用于所有dom节点的innerHTML
        const result = [];
        for (let i = 0; i < dom.length; i++) {
          result[i] = dom[i].innerHTML.trim();
        }
        return result;
      }
    }
  }
  // catch error
  // 所有报错类型的集合
  // 根据输入的类型，抛出错误
  error(errType) {
    const error = {
      "String": "The parameter must be String",
      "DOM": "The parameter must be DOM or can find in HTML",
      "Object": "The parameter must be Object",
      "Array": "The parameter must be Array",
      "mustA&S": "The parameter must be Array or String",
      "lengthEqual": "The length must be equal",
      "noInput": "There is no input tag in DOM's child",
      "DOMS": "The parameter must be HTMLCollection or NodeList",
      "checkbox": "The parameter must be type of checkbox,or must have checkbox childNodes",
      "nodeType": "The parameter must be a confirm DOM,it can be find by ID or value of HTMLCollection/NodeList",
      "select": "The DOM must be SELECT"
    }
    throw new Error(error[errType]);
  }
  // message
  // 消息集合
  // 根据输入的类型，alert消息
  message(mesType) {
    const message = {
      "empty": "内容不能为空",
      "success": "保存成功",
      "zero": "未选中任何单位",
      "first": "已经是第一个啦",
      "last": "已经是最后一个啦"
    }
    alert(message[mesType]);
  }
  // event
  // 封装的点击事件
  // dom为节点，可是一个或多个
  // func为执行的函数
  // funcName为绑定到dom上的属性名，函数将作为一个属性绑定到dom上，这样就可以通过dom下的函数名调用removeEventListener删除
  // boolean用于设置事件是在冒泡还是捕获阶段执行
  // stop用于判断是否组织冒泡
  // prevent用于判断是否阻止默认行为
  click(dom, func, funcName, boolean, stop, prevent) {
    // 判断dom是否为DOM节点
    if (typeof dom === "string") dom = this.find(dom);
    if (this.isDOM(dom) !== "DOM") this.error("DOM");
    // 如果是单节点，执行操作
    if (dom.nodeType) {
      // 绑定属性
      dom[funcName] = function (ev) {
        // 判断冒泡与阻止默认行为
        if (stop) ev.stopPropagation();
        if (prevent) ev.preventDefault();
        // 将this指向dom，这里相当于函数直接调用，如果不绑定this，this将指向window
        // 实际上绑定基本用不上，因为面向对象写的话，this一般都要指向构造函数
        func.call(this, ev); // 绑定this，不然普通函数执行时为自执行，this指向window
      };
      // 绑定事件
      dom.addEventListener("click", dom[funcName], boolean);
    }
    // 如果不是单节点，递归，给所有节点绑定事件
    else {
      for (const v of dom) {
        this.click(v, func, funcName, boolean, stop, prevent);
      }
    }
  }
  // posts
  // 封装fetch的post方法
  // fs为发送地址，data为发送的数据
  // 其实还可以加个参数，定义一下返回结果是要text还是json
  // 我这里由于要操作innerHTML，所以直接获取text
  async post(fs, data) {
    let result = null;

    await fetch(fs, {
        method: "POST",
        body: data
      })
      .then(res => res.text())
      .then(res => result = res);

    return result;
  }
  // get
  // 封装fetch的get方法
  async get(fs) {
    let result = null;

    await fetch(fs)
      .then(res => res.text())
      .then(res => result = res);

    return result;
  }
  // render
  // 渲染HTML，插入innerHTML数据
  // 支持单节点或多节点渲染
  // data为要插入的字符串
  // add用于判断是加上data还是直接赋值为data
  // dom为要赋值的节点，默认为tbody
  render(data, add, dom = this.tbody) {
    if (this.isDOM(dom) === "string") dom = this.find(dom);
    if (this.isDOM(dom) !== "DOM") this.error("DOM");
    if (dom.nodeType) {
      if (!add) dom.innerHTML = data;
      else dom.innerHTML += data;
    } else {
      for (const v of dom) {
        this.render(v, add, dom);
      }
    }

  }
  // get target parentNode，根据标签名查找父节点，找到符合标签名的第一个父元素时返回
  // dom为单节点和节点集合
  // target为想要查找的祖先元素的tagName
  parentNode(dom, target) {
    if (typeof dom === "string") dom = this.find(dom);
    if (this.isDOM(dom) !== "DOM") this.error("DOM");

    // nodeName默认为大写
    target = target.toUpperCase();
    // 如果dom是单节点
    if (dom.nodeType) {
      // 符合查找条件就返回节点，否则递归接续查找
      if (dom.parentNode.nodeName === target) return dom.parentNode;
      else return this.parentNode(dom.parentNode, target);
    }
    // 如果dom为节点集合，创建一个数组，用于保存查找结果
    else {
      const result = [];
      for (let i = 0; i < dom.length; i++) {
        result[i] = this.parentNode(dom[i], parent);
      }
      return result;
    }
  }
  // init obj，根据key值、val值、index值创建对象
  // key为对象的key值，这里对应this.keys
  // value为对象的value值，这里对应td上的data-value
  // index为对应的value中的索引，这里对应this.indexs
  fillObj(key, value, index) {
    // key值必须为Array或者String
    if (!key.length) this.error("mustA&S");
    // 创建空对象
    const obj = {};
    // 如果key值字符串，那么对象只有一个key属性，直接返回
    // 判断是否有index，查找value值
    if (typeof key === "string") return obj[key] = (typeof index !== undefined ? value[index] : value);
    // 如果key是数组
    if (key instanceof Array) {
      // 如果index也是数组
      if (index instanceof Array) {
        // 两个数组长度必须相等，一一对应关系
        if (key.length === index.length) {
          for (let i = 0; i < key.length; i++) {
            obj[key[i]] = value[index[i]];
          }
        } else this.error("lengthEqual");

        return obj;
      }
      // 如果index没有
      if (index === undefined) {
        // 如果value是数组，那么value跟key一一对应
        if (value instanceof Array) {
          for (let i = 0; i < key.length; i++) {
            obj[key[i]] = value[i];
          }
        }
        // 如果value不是数组，所有key赋值为value
        else {
          for (let i = 0; i < key.length; i++) {
            obj[key[i]] = value;
          }
        }

        return obj;
      }
      // 如果有有index，而且此时由于前边判断过index是否为数组，所以此时index不可是数组，那么不管value是什么类型，直接调用index
      else {
        for (let i = 0; i < key.length; i++) {
          obj[key[i]] = value[index];
        }
        // 返回对象
        return obj;
      }
    }
  }
  // get dataset，获取dom的dataset属性值
  // dom为单节点或多节点
  // val为对应的dataset属性
  data(dom, val) {
    if (typeof dom === "string") dom = this.find(dom);
    if (this.isDOM(dom) !== "DOM") this.error("DOM");

    if (dom.nodeType) return dom.dataset[val];
    else {
      const result = [];
      for (let i = 0; i < dom.length; i++) {
        result[i] = dom[i].dataset[val]
      }
      return result;
    }
  }
  // 获取节点的dataset值组成的对象
  getData(dom, value) {
    // 初始化对象类型，这里没做更深的封装，直接写了对象初始化形态
    const data = {
      "list": []
    };
    // 创建数组，用于存放每个tr下的td的data-value值，作为value值传入fillObj
    let arr = [];
    for (let i = 0; i < dom.length; i++) {
      // 取余，每个tr下总共7个td，通过取余能够获取到每个td在tr下的索引值，然后跟this.indexs对应，符合条件的，通过data方法获取data-value值，push到qrr中
      if (i % this.tdLength in this.indexs) {
        // 获取符合条件的data-value值
        arr.push(this.data(dom[i], value));
        // 当arr的长度等于this.indexs的长度时，一轮查找完毕，创建对象数据，然后添加到data中，最后将arr清空开始下一轮查找
        if (arr.length === this.indexs.length) {
          data.list.push(this.fillObj(this.keys, arr));
          arr = [];
        }
      }
    }

    return data;
  }
  // 匹配目标值，清除
  // 只支持数组清除
  // 数组中的项可以是对象，数组或其他类型
  clearList(list, key, value) {
    if (!(list instanceof Array)) this.error("Array");
    // 倒循环数组,用于删除索引
    for (let i = list.length - 1; i >= 0; i--) {
      // 如果数组项为数组
      if (list[i] instanceof Array) {
        // 数组项中有没有对应的key值,有就删除
        if (list[i].includes(key)) list.splice(i, 1);
      }
      // 如果数组项是对象
      // 匹配key值是否等于value值,相等就删除
      else if (list[i] instanceof Object) {
        if (list[i][key] == value) list.splice(i, 1);
      }
      // 其他类型数组项,判断数组项是否等于key,等于就删除
      else {
        if (list[i] == key) list.splice(i, 1);
      }
    }
  }
}