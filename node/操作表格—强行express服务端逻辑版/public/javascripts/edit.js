// 富文本编辑
// 通过setAttribute设置contenteditable属性为true，使节点内容直接可写
class Edit extends Table {
  constructor() {
    super();
  }
  init() {
    this.click(this.tbody, this.edit, "edit", 0, 1);
  }
  edit(ev) {
    if (ev.target.childNodes.length === 1 && ev.target.childNodes[0].nodeType === 3) {
      if (!ev.target.contenteditable) {
        // contenteditable 富文本编辑属性，第一次添加后不会获取焦点，所以需要手动添加焦点
        ev.target.setAttribute("contenteditable", "true");
        // 失焦后，给dataset重新赋值，并移除可编辑时的CSS样式
        ev.target.onblur = function () {
          this.dataset.value = this.innerText;
          this.classList.remove("edit");
        };
        // 获取节点后，添加可编辑时的CSS样式
        ev.target.onfocus = function () {
          this.classList.add("edit");
        };
        ev.target.focus();
      }
    }
  }
}