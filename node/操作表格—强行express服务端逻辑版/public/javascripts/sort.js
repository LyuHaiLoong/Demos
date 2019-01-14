// 排序
// 渲染tbody
class Sort extends Table {
  constructor(id, age, level, select) {
    super();
    this.btnId = this.find(id); // id排序
    this.btnAge = this.find(age); // 年龄排序
    this.btnLevel = this.find(level); // 职级排序
    this.select = this.find(select); // 排序方式
    this.sorted = null; // 当前排序模式，用于切换class选中状态
  }
  init() {
    const status = () => {
      if (this.tbody.status === this.showAll) return 0;
      else if (this.tbody.status === this.showChecked) return 1;
      else return 2;
    };

    this.click(this.btnId, this.sortId.bind(this, "/sort/id", this.select, status), "sortId", 0, 1, 1);
    this.click(this.btnAge, this.sortAge.bind(this, "/sort/age", this.select, status), "sortAge", 0, 1, 1);
    this.click(this.btnLevel, this.sortLevel.bind(this, "/sort/level", this.select, status), "sortLevel", 0, 1, 1);
    this.click(this.btnId, this.active.call(this, "active"), "avtive", 0, 1, 1);
    this.click(this.btnAge, this.active.call(this, "active"), "avtive", 0, 1, 1);
    this.click(this.btnLevel, this.active.call(this, "active"), "avtive", 0, 1, 1);
  }
  active(cls) {
    // 返回箭头函数，保证this指向的同时，可以获取ev对象
    return ev => {
      if (!this.select.classList.contains(cls)) this.select.classList.add(cls);
      if (ev.target.classList.contains(cls)) return;
      ev.target.classList.add(cls);

      if (!this.sorted) this.sorted = ev.target;
      else {
        this.sorted.classList.remove(cls);
        this.sorted = ev.target;
      }
    }
  }
  // id排序
  // fs为请求地址
  // change为要改变选中状态的select标签
  async sortId(fs, change, callback) {
    // 改变select选中状态
    this.changeSelect(change);
    // 发送排序请求，然后渲染
    const res = await this.get(fs + callback() + this.select.value);
    this.render(res);
  }
  // 年龄排序

  async sortAge(fs, change, callback) {
    // 改变select选中状态
    this.changeSelect(change);
    // 发送排序请求，然后渲染
    const res = await this.get(fs + callback() + this.select.value);
    this.render(res);
  }
  // 职级排序

  async sortLevel(fs, change, callback) {
    // 改变select选中状态
    this.changeSelect(change);
    // 发送排序请求，然后渲染
    const res = await this.get(fs + callback() + this.select.value);
    this.render(res);
  }
  changeSelect(select, toggle1 = 0, toggle2 = 1) {
    if (typeof select === "string") select = this.find(select);
    if (this.isDOM(select) !== "DOM") this.error("DOM");

    if (select.nodeType) {
      if (select.nodeName !== "SELECT") this.error("select");
      // 根据selectIndex判断选中项，并切换选中项
      if (select.selectedIndex == toggle1) select.selectedIndex = toggle2;
      else if (select.selectedIndex == toggle2) select.selectedIndex = toggle1;
    } else {
      for (const v of select) {
        this.changeSelect(v, toggle1, toggle2);
      }
    }
  }
}