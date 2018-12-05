// 文档渲染
class Render extends Father {
  constructor(music, lrc, list, control) {
    super();
    this.music = this.find(music);
    this.lrc = this.find(lrc);
    this.list = this.find(list);
    this.control = this.find(control);
  }
  initMusic(data, id, prop, i) {
    if (data === true) {
      if (i !== undefined) {
        this.music[i].src = "";
        this.music[i].setAttribute("data-id", id);
      } else {
        this.music.src = "";
        this.music.setAttribute("data-id", id);
      }
    } else {
      if (i !== undefined) {
        this.music[i].src = this.getId(data, id)[prop];
        this.music[i].setAttribute("data-id", id);
      } else {
        this.music.src = this.getId(data, id)[prop];
        this.music.setAttribute("data-id", id);
      }
    }
  }
  initLrc(data, id, [x = "h3", y = "p", z = 0] = [], [a = "title", b = "lrc"] = []) { // [x,y] = []，避免不传参报错
    if (data === true) {
      this.html(this.find(x, this.lrc)[z], "");
      this.html(this.find(y, this.lrc)[z], "");
    } else {
      this.html(this.find(x, this.lrc)[z], this.getId(data, id)[a]);
      this.html(this.find(y, this.lrc)[z], this.getId(data, id)[b].replace(/\s|,|，|\||。|\/|\\|、/g, "<br>"));
    }
  }
  initList(data, prop, ele, cls, flag) {
    if (data === true) this.html(this.list, "");
    else this.html(this.list, this.renderTree(data, prop, ele, cls, flag)); // 形成列表
  }
  listActive(ele, data, id, flag, cls) {
    if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
    if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
    ele = this.find(ele);

    if (ele.nodeType) {
      flag = this.getId(data, id)[flag];
      if (ele.innerHTML === flag) ele.classList.add(cls);
    } else {
      for (let i = 0; i < ele.length; i++) {
        this.listActive(ele[i], data, id, flag, cls);
      }
    }
  }
  getId(data, id) {
    if (!(data instanceof Array)) throw new Error("data must be Array");
    if (id === undefined) throw new Error("id must be input");
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) return data[i];
    }
  }
  getProp(data, prop, flag) {
    if (!(data instanceof Array)) throw new Error("data must be Array");
    if (prop === undefined || flag === undefined) throw new Error("property must be input");

    for (let i = 0; i < data.length; i++) {
      if (data[i][prop] === flag) return data[i];
    }
  }
  renderTree(data, prop, a, b, flag, m, n, x = "ul", y = "li") { // data数据源，prop数据属性，a选中标签，b选中标签class，flag选中判定值，m父节点class，n子节点class
    // 创建父节点
    let temp = n ? `<${x} class="${n}">` : `<${x}>`;
    // data类型为数组-对象结构，所以可以通过forEach，此处可修改
    data.forEach((val) => {
      if (m) {
        if (flag) {
          if (val[prop] === flag) temp += `<${y} class="${m}"><${a} class="${b}">${/^(img|input)$/.test(a) ? "" : `</${a}>`}${val[prop]}${/^(img|input)$/.test(y) ? "" : `</${y}>`}`;
          else temp += `<${y} class="${m}">${val[prop]}${/^(img|input)$/.test(y) ? "" : `</${y}>`}`;
        } else {
          if (a) {
            if (b) temp += `<${y} class="${m}"><${a} class="${b}">${/^(img|input)$/.test(a) ? "" : `</${a}>`}${val[prop]}${/^(img|input)$/.test(y) ? "" : `</${y}>`}`;
            else temp += `<${y} class="${m}"><${a}>${/^(img|input)$/.test(a) ? "" : `</${a}>`}${val[prop]}${/^(img|input)$/.test(y) ? "" : `</${y}>`}`;
          } else temp += `<${y} class="${m}">${val[prop]}${/^(img|input)$/.test(y) ? "" : `</${y}>`}`;
        }
      } else {
        if (flag) {
          if (val[prop] === flag) temp += `<${y}><${a} class="${b}">${/^(img|input)$/.test(a) ? "" : `</${a}>`}${val[prop]}${/^(img|input)$/.test(y) ? "" : `</${y}>`}`;
          else temp += `<${y}>${val[prop]}${/^(img|input)$/.test(y) ? "" : `</${y}>`}`;
        } else {
          if (a) {
            if (b) temp += `<${y}><${a} class="${b}">${/^(img|input)$/.test(a) ? "" : `</${a}>`}${val[prop]}${/^(img|input)$/.test(y) ? "" : `</${y}>`}`;
            else temp += `<${y}><${a}>${/^(img|input)$/.test(a) ? "" : `</${a}>`}${val[prop]}${/^(img|input)$/.test(y) ? "" : `</${y}>`}`;
          } else temp += `<${y}>${val[prop]}${/^(img|input)$/.test(y) ? "" : `</${y}>`}`;
        }
      }
    });

    temp += `</${x}>`;

    return temp;
  }
  clearTree(tag) {
    const reg = new RegExp(`<${tag}>${/^(img|input)$/.test(tag) ? "" : `.+<\/${tag}>$`}`);
    this.list.innerHTML = this.list.innerHTML.replace(reg, "");
  }
}