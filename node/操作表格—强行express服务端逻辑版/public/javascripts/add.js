// 添加tr
// 渲染tbody
class Add extends Table {
  constructor(id, name, age, job, level, btn) {
    super();
    this.id = this.find(id); // 工号输入框
    this.name = this.find(name); // 姓名输入框
    this.age = this.find(age); // 年龄输入框
    this.job = this.find(job); // 岗位输入框
    this.level = this.find(level); // 职级输入框
    this.btn = this.find(btn); // 添加按钮
  }
  init() {
    // 回调函数，用于判断当前表格显示状态，发送状态码，确认渲染数据
    const cb = () => {
      if (this.tbody.status === this.showAll) return 0;
      else if (this.tbody.status === this.showChecked) return 1;
      else return 2;
    }
    this.click(this.btn, this.add.call(this, "/add", this.id, this.name, this.age, this.job, this.level, cb), "add", 0, 1, 1);
    this.keyup(document, this.add.call(this, "/add", this.id, this.name, this.age, this.job, this.level, cb), "add", 0, 1, 1);
  }
  // 添加tr
  // fs为数据发送地址
  // id、name、age、job、level为要获取数据对象的节点
  add(fs, id, name, age, job, level, callback) {
    // 因为要调用click事件的事件对象，所以要将函数作为返回值，通过闭包调用需要的其余参数
    // 创建返回函数，异步函数，为了等待数据的返回
    // await只能在async函数中使用
    const func = async ev => {
      // 判断是否为点击或键盘事件
      // 然后再判断键盘事件是够为回车
      // 然后再判断执行事件的目标是否为text或number的input输入框
      if (ev.type !== "click" && (ev.type !== "keyup" || ev.keyCode !== 13 || !/text|number/.test(ev.target.type))) return;
      // 判断输入框中是否为空，是空就alert
      if (!this.isEmpty(id, name, age, job, level)) return this.message("empty");
      // 如果当前显示状态不是已选，就将全选状态取消
      if (this.sAll.checked && this.tbody.status !== this.showChecked) this.sAll.checked = 0;
      // 输入框焦点重置
      this.id.focus();
      // 创建初始化数据，就发送这一条，所以就直接写了，函数复用性降低
      const data = {
        id: id.value,
        name: name.value,
        age: age.value,
        job: job.value,
        level: level.value,
        // 判断显示状态是否为已选，已选显示状态时添加的新数据添加为选中状态
        checked: this.tbody.status === this.showChecked ? "1" : "0"
      };
      // 清空输入框
      this.clear(id, name, age, job, level);
      // 等待数据返回，然后渲染HTML
      const res = await this.post(fs + "/" + callback(), JSON.stringify(data));
      this.render(res);
    }

    // 返回函数，作为事件调用函数
    return func;
  }
  // 清空输入框
  clear() {
    for (let i = 0; i < arguments.length; i++) {
      arguments[i].value = "";
    }
  }
  // 判断输入框是否为空
  isEmpty() {
    for (const v of arguments) {
      if (!v.value.trim()) return 0;
    }
    return 1;
  }
  // 封装键盘事件，逻辑同点击事件
  keyup(dom, func, funcName, boolean, stop, prevent) {
    if (typeof dom === "string") dom = this.find(dom);
    if (this.isDOM(dom) !== "DOM") this.add.error("DOM");

    if (dom.nodeType) {
      dom[funcName] = function (ev) {
        if (stop) ev.stopPropagation();
        if (prevent) ev.preventDefault();
        func.call(this, ev);
      }
      dom.addEventListener("keyup", dom[funcName], boolean);
    } else {
      for (const v of dom) {
        this.keyup(v, func, funcName, boolean, stop, prevent);
      }
    }
  }
}