class Func extends Table {
  constructor(a, b, c) { // num,age,del
    super();
    this.a = this.find(...a)[0];
    this.b = this.find(...a)[1];
    this.c = this.find(...a)[2];
    this.d = this.find(...a)[3];
    this.e = this.find(b);
    this.f = this.find(c, this.i);
    this.selectNum = 0;
  }
  init() {
    this.click(this.a, this.orderNum.bind(this, this.f, "td", 1, this.a, "order", "i", "up"),
      "orderNum", 0, 1, 1);
    this.click(this.a, this.changeActive.bind(this.a, this.b, "active"), "changeActive", 0, 1, 1);
    this.click(this.b, this.orderAge.bind(this, this.f, "td", 3, this.b, "order", "i", "up"),
      "orderAge", 0, 1, 1);
    this.click(this.b, this.changeActive.bind(this.b, this.a, "active"), "changeActive", 0, 1, 1);
    this.click(this.c, this.delete.bind(this, this.f, this.e), 0, 1, 1);
    this.click(this.d, this.save.bind(this, "/save", "保存成功"));
    this.click(this.e, this.select.bind(this, this.e, this.f), "select", 0, 1);
    // this.click(this.i, this.selectJudge.bind(this), 0, 1, 1);
    this.click(this.i, this.selectOne.bind(this), 0, 1);
    this.click(this.i, this.moveEle.call(this, "上移", "下移", "删除"), "moveEle", 0, 1);
  }
  changeActive(a, b) {
    if (!this.classList.contains(b)) {
      this.classList.add(b);
      a.classList.remove(b);
    }
  }
  orderNum(a, b, c, d, e, f, g) {
    this.toggleClass(this.find(f, d)[0], g);
    if (this.flag(d, e)) this.up(a, b, c);
    else this.down(a, b, c);
  }
  orderAge(a, b, c, d, e, f, g) {
    this.toggleClass(this.find(f, d)[0], g);
    if (!this.flag(d, e)) this.up(a, b, c);
    else this.down(a, b, c);
  }
  select(a, b) {
    if (a.checked) {
      this.setAttribute(a, "checked", "checked");
      this.selectAll(a, b);
    } else {
      this.removeAttribute(a, "checked");
      this.cancelSelectAll(a, b);
    }
  }
  selectOne(ev) {
    if (ev.target.nodeName === "INPUT" && ev.target.checked) this.setAttribute(ev.target, "checked", "checked");
    else if (ev.target.nodeName === "INPUT" && !ev.target.checked) this.removeAttribute(ev.target, "checked");
    this.selectJudge(ev);
  }
  selectJudge(ev) {
    if (ev.target.nodeName === "INPUT" && ev.target.checked) this.selectNum++;
    else if (ev.target.nodeName === "INPUT" && !ev.target.checked) this.selectNum--;
    if (this.e.checked) this.e.checked = 0;;
    if (this.selectNum === this.f.length) {
      this.e.checked = 1;
      this.selectNum = 0;
    }
    // let num = 0;
    // const judge = function (ev) {
    //   console.log(num);

    //   if (ev.target.nodeName === "INPUT" && ev.target.checked) num++;
    //   else if (ev.target.nodeName === "INPUT" && !ev.target.checked) num--;
    //   if (this.e.checked) this.e.checked = 0;
    //   if (num === this.f.length) {
    //     this.e.checked = 1;
    //     num = 0;
    //   }
    // }
    // return judge.bind(this);
  }
  delete(a, b) {
    for (let i = a.length - 1; i >= 0; i--) {
      if (this.find("input", a[i])[0].checked) this.outerHTML(a[i], ""); // for-of循环就是封装好的按索引查找，如果在循环里执行删除操作的话，因为不能执行类似数组去重中的i--操作，会跳索引
    }
    if (b.checked) b.checked = 0;
  }
  selectAll(a, b) {
    a = this.find(a);
    b = this.find(b);
    if (a.nodeType) {
      if (a.checked) {
        if (b.nodeType) {
          this.setAttribute("b", "checked", "checked");
          b.checked = 1;
        } else {
          for (let v of b) {
            v = this.find("input", v)[0];
            if (!v.checked) {
              this.setAttribute(v, "checked", "checked"); //v.checked = 1;
              v.checked = 1;
            }
          }
        }
      }
    } else this.error(0, a);

    this.selectNum = this.f.length;
  }
  cancelSelectAll(a, b) {
    a = this.find(a);
    b = this.find(b);
    if (a.nodeType) {
      if (a.checked) {
        if (b.nodeType) {
          this.removeAttribute(b, "checked");
          b.checked = 0;
        }
      } else {
        for (let v of b) {
          v = this.find("input", v)[0];
          this.removeAttribute(v, "checked"); 
          v.checked = 0;
        }
      }
    } else this.error(0, a);

    this.selectNum = 0;
  }
  up(a, b, c) { // HTMLCollection | NodeList、tag、index
    if (!a.length && !(a instanceof Object)) this.error(0, a);
    if (!(a instanceof Array)) a = Array.from(a);
    a = a.sort((x, y) => {
      x = this.find(b, x)[c];
      y = this.find(b, y)[c];
      x = this.html(x);
      y = this.html(y);
      return x - y;
    });

    let r = "";
    a.forEach(v => {
      r += v.outerHTML;
    });
    this.innerHTML(this.i, r);
  }
  down(a, b, c) {
    if (!a.length && !(a instanceof Object)) this.error(0, a);
    if (!(a instanceof Array)) a = Array.from(a);
    a = a.sort((x, y) => {
      x = this.find(b, x)[c];
      y = this.find(b, y)[c];
      x = this.html(x);
      y = this.html(y);
      return y - x;
    });

    let r = "";
    a.forEach(v => {
      r += v.outerHTML;
    });
    this.innerHTML(this.i, r);
  }
  flag(a, b) {
    a = this.find(a);
    if (!a.nodeType) this.error(0, a);
    a[b] = !a[b];
    return !a[b];
  }
  toggleClass(a, b) {
    a = this.find(a);

    if (a.nodeType) a.classList.toggle(b);
    else {
      for (const v of a) {
        this.toggleClass(v, b);
      }
    }
  }
  moveEle(a, b, c) {
    let tar, pre, next, tarHTML, preHTML, nextHTML;
    const d = function (ev) {
      if (ev.target.nodeName !== "BUTTON") return;

      switch (this.html(ev.target)) {
        case a:
          tar = this.parentNode(ev.target, "tr");
          if (tar === this.f[0]) this.message("已经是第一个啦");
          else {
            pre = tar.previousElementSibling;
            preHTML = this.html(pre);
            tarHTML = this.html(tar);
            this.innerHTML(tar, preHTML);
            this.innerHTML(pre, tarHTML);
          }
          break;
        case b:
          tar = this.parentNode(ev.target, "tr");
          if (tar === this.f[this.f.length - 1]) this.message("已经是最后一个啦");
          else {
            next = tar.nextElementSibling;
            nextHTML = this.html(next);
            tarHTML = this.html(tar);
            this.innerHTML(tar, nextHTML);
            this.innerHTML(next, tarHTML);
          }
          break;
        case c:
          tar = this.parentNode(ev.target, "tr");
          this.outerHTML(tar, "");
          break;
      }
    }

    return d.bind(this);
  }
  async save(a, b) {
    await this.post(a);
    this.message(b);
  }
  post(a) { // url
    fetch(a, {
      method: "POST",
      body: this.parse()
    });
  }
  parse() {
    const tr = this.find("tr", this.i);
    const data = {
      "list": [],
      "length": 0
    }

    for (let i = 0; i < tr.length; i++) {
      const td = this.find("td", tr[i]);
      const obj = {};
      obj.id = this.html(td[1]);
      obj.name = this.html(td[2]);
      obj.age = this.html(td[3]);
      data.list[i] = obj;
    }
    data.length = data.list.length;
    return JSON.stringify(data);
  }
  message(a) {
    alert(a);
  }
  html(a) {
    return a.innerHTML;
  }
  parentNode(a, b) {
    let r = null;

    b.replace(/([#.]?)(.+)/, ($0, $1, $2) => {
      switch ($1) {
        case "#":
          while (!r) {
            a.parentNode.id === $2 ? r = a.parentNode : a = a.parentNode;
          }
          break;
        case ".":
          while (!r) {
            a.parentNode.classList.contains($2) ? r = a.parentNode : a = a.parentNode;
          }
          break;
        default:
          while (!r) {
            a.parentNode.nodeName.toLowerCase() === $2 ? r = a.parentNode : a = a.parentNode;
          }
      }
    });

    return r;
  }
}