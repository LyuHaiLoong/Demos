// 全选与清空
// 根据显示状态渲染tbody
class Delete extends Table {
  constructor(del, delAll, len, key, index) {
    super();
    this.del = this.find(del); // 批量删除按钮
    this.delAll = this.find(delAll); // 清空按钮
  }
  init() {
    this.click(this.del, this.delete.bind(this, "/del", this.td, "value", () => {
      if (this.tbody.status === this.showAll) return 0;
      else if (this.tbody.status === this.showChecked) return 1;
      else return 2;
    }), "delete", 0, 1, 1);
    this.click(this.delAll, this.delteAll.bind(this, this.tbody, () => {
      this.tbody.checked = 0;
      if (this.sAll.checked) this.sAll.checked = 0;
      this.get("/del/all");
    }), "deleteAll", 0, 1, 1);
  }
  // 异步函数，等待请求结果后，渲染
  async delete(fs, dom, value, callback) {
    if (typeof dom === "string") dom = this.find(dom);
    if (this.isDOM(dom) !== "DOM") this.error("DOM");
    // getData只支持节点结合
    if (dom.nodeType) this.error("DOMS");
    // 获取所有数据
    const data = this.getData(dom, value);
    // 清空未选
    this.clearList(data.list, "checked", 0);
    // 判断是否为空
    if (!data.list.length) return this.message("zero");
    // 发送数据，然后渲染
    const res = await this.post(fs + "/" + callback(), JSON.stringify(data));
    this.render(res);
  }
  // 清空
  delteAll(dom, callback) {
    if (typeof dom === "string") dom = this.find(dom);
    if (this.isDOM(dom) !== "DOM") this.error("DOM");
    // 直接清空内容
    if (dom.nodeType) dom.innerHTML = "";
    else {
      for (const v of dom) {
        v.innerHTML = "";
      }
    }
    if (typeof callback === "function") callback();
  }
}
// 垃圾场
// 前端逻辑，删除还是前端操作最好
// delete(dom) {
//   if (typeof dom === "string") dom = this.find("input", dom);
//   if (dom.nodeType === 1 && dom.nodeName !== "INPUT") dom = this.find("input", dom);
//   if (this.isDOM(dom) !== "DOM") this.error("DOM");

//   if (dom.nodeType) {
//     if (dom.type !== "checkbox") return;
//     if (dom.checked) list[0] = dom.dataset.id;
//   } else {
//     for (let i = dom.length - 1; i >= 0; i--) {
//       if (dom[i].type !== "checkbox") continue;
//       if (dom[i].checked) {
//         this.parentNode(dom[i], "tr").outerHTML = "";
//         this.tbody.checked--;
//       }
//     }
//   }
//   // 后端渲染过于繁琐，弃用
//   // const res = await this.post(fs, JSON.stringify(list));
//   // this.render(res);
// }