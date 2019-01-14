// 已选、未选、全选切换
// 渲染tbody
class Shown extends Table {
  init() {
    this.click(this.showAll, this.all.call(this, "/shown/0"), "showAll", 0, 1);
    this.click(this.showChecked, this.all.call(this, "/shown/1"), "showChecked", 0, 1);
    this.click(this.showUnchecked, this.all.call(this, "/shown/2"), "showUnchecked", 0, 1);
  }
  // 显示已选
  // 前端不执行操作，后端根据求情码调用渲染数据
  checked(fs) {
    return async ev => {
      // if (this.tbody.status === ev.target) return;
      this.tbody.status = ev.target;
      const res = await this.get(fs);
      this.render(res);
    }
  }
  // 显示未选
  // 前端不执行操作，后端根据求情码调用渲染数据
  unchecked(fs) {
    return async ev => {
      // if (this.tbody.status === ev.target) return;
      this.tbody.status = ev.target;
      const res = await this.get(fs);
      this.render(res);
    }
  }
  // 显示全部
  // 前端不执行操作，后端根据求情码调用渲染数据
  all(fs) {
    return async ev => {
      // if (this.tbody.status === ev.target) return;
      this.tbody.status = ev.target;
      const res = await this.get(fs);
      this.render(res);
    }
  }
}


// 大型垃圾场
// init() {
//   this.click(this.showAll, this.all.call(this, "/shown/all", this.td, "value", () => {
//     if (this.tbody.status === this.showChecked) return "0b1";
//     else if (this.tbody.status === this.showUnchecked) return "0b0";
//     else return "0a1";
//   }), "showAll", 0, 1);
//   this.click(this.showChecked, this.checked.call(this, "/shown/checked", this.td, "value", () => {
//     if (this.tbody.status === this.showAll) return "1a";
//     else return "1b";
//   }), "showChecked", 0, 1);
//   this.click(this.showUnchecked, this.unchecked.call(this, "/shown/unchecked", this.td, "value", () => {
//     if (this.tbody.status === this.showAll) return "2a";
//     else return "2b";
//   }), "showUnchecked", 0, 1);
// }
// checked(fs, dom, value, callback) {
//   if (typeof dom === "string") dom = this.find(dom);
//   if (this.isDOM(dom) !== "DOM") this.error("DOM");

//   if (dom.nodeType) this.error("DOMS");


//   return async ev => {
//     const flag = +(ev.target === this.tbody.status);

//     const data = this.getData(dom, value);

//     this.clearList(data.list, "checked", flag);

//     const res = await this.post(fs + callback() + +flag, JSON.stringify(data));
//     this.render(res);
//     // 放在最后更在，防止callback判断错误
//     if (!flag) this.tbody.status = ev.target;
//   }
// }
// unchecked(fs, dom, value, callback) {
//   if (typeof dom === "string") dom = this.find(dom);
//   if (this.isDOM(dom) !== "DOM") this.error("DOM");

//   if (dom.nodeType) this.error("DOMS");

//   return async ev => {
//     const flag = +(ev.target === this.tbody.status);

//     const data = this.getData(dom, value);

//     this.clearList(data.list, "checked", !flag);

//     const res = await this.post(fs + callback() + +!flag, JSON.stringify(data));
//     this.render(res);

//     if (!flag) this.tbody.status = ev.target;
//   }
// }
// all(fs, dom, value, callback) {
//   if (typeof dom === "string") dom = this.find(dom);
//   if (this.isDOM(dom) !== "DOM") this.error("DOM");

//   if (dom.nodeType) this.error("DOMS");

//   return async ev => {
//     const data = this.getData(dom, value);

//     this.clearList(data.list, "checked", callback()[callback().length - 1]); // 获取最后一位状态码

//     const res = await this.post(fs + callback(), JSON.stringify(data));
//     this.render(res);

//     if (this.tbody.status !== ev.target) this.tbody.status = ev.target;

//     if (ev.target !== this.tbody.status) this.tbody.status = ev.target;
//   }
// }