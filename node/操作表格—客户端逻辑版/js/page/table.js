class Table {
  constructor() {
    this.t = this.find("table")[0];
    this.i = this.find("#tbody", this.t);
  }
  // find DOM
  find(a, b = document, i) {
    // 判断a
    if (/\[object (HTMLCollection|NodeList|HTML.+)\]/.test(a.toString())) return a;
    if (typeof a !== "string") this.error(0, a); // 如果不是字符串就报错
    // 判断b
    if (typeof b === "string") b = this.find(b);
    if (typeof i === "number") b = b[i];
    if (!/1|9/.test(b.nodeType)) this.error(0, b); // 如果不是DOM节点就报错
    // 查找a
    a.replace(/([.#]?)(.+)/, ($0, $1, $2) => {
      switch ($1) {
        case "#":
          a = b.querySelector($0);
          break;
        case ".":
          a = b.getElementsByClassName($2);
          break;
        default:
          a = b.getElementsByTagName($2).length ? b.getElementsByTagName($2) : document.getElementsByName($2);
      }
    });
    // return result
    return a;
  }
  // click event
  click(a, b, c, d, e, f) { //ele,func,funcName,boolean,stop,prevent；取消call绑定，通过bind传入的绑定了this函数，无法再通过call绑定this
    a = this.find(a);
    if (a.nodeType) {
      a[c] = function (ev) {
        if (e) ev.stopPropagation(); // 阻止冒泡
        if (f) ev.preventDefault(); // 阻止默认行为
        b.call(this,ev);
      }
      a.addEventListener("click", a[c], d);
    } else {
      for (const v of a) {
        this.click(v, b, c, d, g, e, f);
      }
    }
  }
  // keyup event
  keyup(a, b, c, d, e, f) { // ele,func,funcName,boolean,stop,prevent
    a = this.find(a);

    if (a.nodeType) {
      a[c] = function (ev) {
        if (e) ev.stopPropagation();
        if (f) ev.preventDefault();
        b.call(this,ev);
      }
      a.addEventListener("keyup", a[c], d);
    } else {
      for (const v of a) {
        this.keyup(v, b, c, d, e, f)
      }
    }
  }
  // write table innerHTML
  table(a, b, c, d) { // DOM,data,key
    let r = "";
    if (b instanceof Array) {
      b.forEach(v => {
        r += this.template(v, c);
      })
    } else {
      if (typeof b !== "object") this.error(1);
      else r += this.template(b, c);
    }
    this.innerHTML(a, r, d);
  }
  // table tamplate
  template(a, b) {
    if (typeof a !== "object") this.error(0, a);
    if (a instanceof Array) {
      return `<tr>
              <td><input type="checkbox"></td>
              ${(function(){
                  let r = "";                 
                  a.forEach(v=>{
                    r += `<td>${v}</td>\n`;
                  });
                  return r;
                })()
              }
              <td>
                <div class="btns">
                  <button>上移</button>
                  <button>下移</button>
                  <button>删除</button>
                </div>
              </td>
            </tr>`
    }
    return `<tr>
              <td><input type="checkbox"></td>
              ${(function(){
                  let r = "";                 
                  b.forEach(v=>{
                    r += `<td>${a[v]}</td>\n`;
                  });
                  return r;
                })()
              }
              <td>
                <div class="btns">
                  <button>上移</button>
                  <button>下移</button>
                  <button>删除</button>
                </div>
              </td>
            </tr>`
  }
  // write innerHTML
  innerHTML(a, b, c) {
    a = this.find(a);
    if (a.nodeType) {
      if (c) a.innerHTML += b;
      else a.innerHTML = b;
    } else {
      for (const v of a) {
        this.innerHTML(v, b, c);
      }
    }
  }
  // write outerHTML
  outerHTML(a, b) {
    a = this.find(a);
    if (a.nodeType) a.outerHTML = b;
    else {
      for (const v of a) {
        this.outerHTML(v, b);
      }
    }
  }
  // set attribute——keep the checked status alive
  setAttribute(a, b, c) {
    a = this.find(a);
    if (a.nodeType) {
      a.setAttribute(b, c);
    } else {
      for (const v of a) {
        this.setAttribute(v, b, c);
      }
    }
  }
  removeAttribute(a, b) {
    a = this.find(a);
    if (a.nodeType) {
      a.removeAttribute(b);
    } else {
      for (const v of a) {
        this.removeAttribute(v, b);
      }
    }
  }
  // error collection
  error(a, b = "") {
    const c = {
      0: "Invalid parameter ",
      1: "Data Error: The data type is not supported",
      2: alert("输入不能为空")
    }
    if (c[a]) throw new Error(c[a] + b + ".");
  }
}