// 单选与全选
// 只更改数据，不渲染
class Check extends Table {
  init() {
    this.click(this.sAll, this.checkAll.call(this, "/check/all", this.tbody), "checkAll", 0, 1);
    this.click(this.tbody, this.checkOne.call(this, "/check/one", "td", "tr", "value"), "checkOne", 0, 1);
  }
  // 选择一个
  // fs为数据发送地址
  // child为数据子元素，这里对应td
  // parent为数据子元素的父元素，这里对应tr
  // value为要查找的dataset属性
  // 整个逻辑——点击多选标签，找到它的父元素，给父元素添加dataset，值为checkebox的选中状态。然后再找到目标的祖先元素，用于获取所有的dataset值，用于fillObj创建对象
  checkOne(fs, child, parent, value) {
    return async ev => {
      // 不是checkebox，不执行操作
      if (ev.target.type !== "checkbox") return;
      // 找到点击目标的目标祖先节点，这里为tr
      // 逻辑——获取点击目标的祖先元素，然后该最先元素将作为获取数据的节点使用
      const parentNode = this.parentNode(ev.target, parent);
      // 获取当前选中状态——注意！鼠标默认事件为点击checkbox添加/取消选中状态，默认事件将在click事件前执行
      // 所以flag就是点击后实际checkebox的选中状态
      const flag = +(ev.target.checked);
      // 获取点击目标的另一个目标祖先节点
      // 逻辑——此祖先节点为点击目标的作为点击状态存储的祖先节点为其添加dataset
      const targetParent = this.parentNode(ev.target, child);
      targetParent.dataset[value] = flag;
      // 获取parent下的child的dataset组成的对象，作为数据发送
      const postData = this.getData(this.find(child, parentNode), value);

      const res = await this.post(fs + flag, JSON.stringify(postData));

      // 判断后台返回结果,如果此时所有标签都被选中,将返回1,然后给全选按钮添加选中状态
      if (+res) this.sAll.checked = 1;
      // 只要当前目标是未选中状态,就取消全选按钮的选中状态
      if (!flag) {
        if (this.sAll.checked) this.sAll.checked = 0;
      }
    }
  }
  // 全选
  // fs为发送数据地址
  // dom为节点
  // 全部查找一遍需要更改状态的dom，然后再渲染太二了，所以直接前端改了
  checkAll(fs, dom) {
    return ev => {
      const flag = +(ev.target.checked);
      // 发送状态，状态码为0、1.对应全选按钮的选中状态，0为取消全选，1为全选
      this.get(fs + flag);
      // 全选与取消全选
      if (flag) this.checkboxChecked(dom);
      else this.checkboxCancel(dom);
    }
  }
  // 全选
  checkboxChecked(dom) {
    if (typeof dom === "string") dom = this.find(dom);
    if (this.isDOM(dom) !== "DOM") this.error("DOM");

    if (dom.nodeType) {
      if (dom.type === "checkbox" && !dom.checked) dom.checked = 1;
      else {
        const checkboxs = this.find("input", dom);
        if (!checkboxs.length) this.error("checkbox");

        let count = 0;
        for (const v of checkboxs) {
          if (v.type === "checkbox") {
            if (!v.checked) v.checked = 1;
            count++;
          }
        }
        if (!count) this.error("checkbox");
      }
    }
  }
  // 取消全选
  checkboxCancel(dom) {
    if (typeof dom === "string") dom = this.find(dom);
    if (this.isDOM(dom) !== "DOM") this.error("DOM");

    if (dom.nodeType) {
      if (dom.type === "checkbox" && dom.checked) dom.checked = 0;
      else {
        const checkboxs = this.find("input", dom);
        if (!checkboxs.length) this.error("checkbox");

        let count = 0;
        for (const v of checkboxs) {
          if (v.type === "checkbox") {
            if (v.checked) v.checked = 0;
            count++;
          }
        }
        if (!count) this.error("checkbox");
      }
    }
  }


  // 垃圾场
  // 前端逻辑更改选中状态，没啥可看的
  // checkedCount(child, parent = document) {
  //   const dom = this.find(child, parent);
  //   if (dom.nodeType) {
  //     if (+dom.firstElementChild.dataset.value) this.tbody.checked++;
  //   } else {
  //     for (const v of dom) {
  //       if (+v.firstElementChild.dataset.value) this.tbody.checked++;
  //     }
  //   }

  //   // this.initShown();
  //   if (this.tbody.checked === dom.length && dom.length) this.sAll.checked = 1;
  // }
  // checkedAll(dom) {
  //   if (typeof dom === "string") dom = this.find("input", dom);
  //   if (dom.nodeType === 1 && dom.nodeName !== "INPUT") dom = this.find("input", dom);
  //   if (this.isDOM(dom) !== "DOM") this.error("DOM");
  //   if (dom.nodeType) {
  //     if (dom.type !== "checkbox") return
  //     if (!this.sAll.checked) {
  //       if (!dom.checked) return;
  //       else {
  //         dom.checked = 0;
  //         dom.parentNode.dataset.value = 0;
  //         dom.removeAttribute("checked");
  //       }
  //       this.tbody.checked = 0;
  //       // this.close();
  //     } else {
  //       if (dom.checked) return;
  //       else {
  //         dom.checked = 1;
  //         dom.parentNode.dataset.value = 1;
  //         dom.setAttribute("checked", "");
  //       }
  //       this.tbody.checked = 1;
  //       // this.open();
  //     }
  //   } else {
  //     for (const v of dom) {
  //       if (v.type === "checkbox") {
  //         if (!this.sAll.checked) {
  //           if (!v.checked) continue;
  //           else {
  //             v.checked = 0;
  //             v.parentNode.dataset.value = 0;
  //             v.removeAttribute("checked");
  //           }
  //         } else {
  //           if (v.checked) continue;
  //           else {
  //             v.checked = 1;
  //             v.parentNode.dataset.value = 1;
  //             v.setAttribute("checked", "");
  //           }
  //         }
  //       }
  //     }
  //     if (!this.sAll.checked) {
  //       this.tbody.checked = 0;
  //       // this.close();
  //     } else {
  //       this.tbody.checked = dom.length;
  //       // this.open();
  //     }
  //   }
  // }
  // checked() {
  //   return (ev) => { // 保证this指针指向
  //     if (ev.target.type === "checkbox") {
  //       ev.target.parentNode.dataset.value = +ev.target.checked;

  //       if (ev.target.checked) {
  //         ev.target.setAttribute("checked", "");
  //         this.tbody.checked++;
  //         const input = this.find("input", this.tbody);
  //         let len = 0;
  //         for (const v of input) {
  //           if (v.type === "checkbox") len++;
  //         }
  //         if (this.tbody.checked === len) this.sAll.checked = 1;
  //       } else {
  //         ev.target.removeAttribute("checked");
  //         this.tbody.checked--;
  //         this.sAll.checked = 0;
  //       }
  //     }
  //   }
  // }
}

// 根据选中状态显示已选、未选、全选按钮
// initShown() {
//   if (this.tbody.checked) this.open();
//   else this.close();
// }
// open() {
//   this.showChecked.disabled = 0;
//   this.showChecked.parentNode.classList.add("active");
//   this.showUnchecked.disabled = 0;
//   this.showUnchecked.parentNode.classList.add("active");
// }
// close() {
//   this.showChecked.disabled = 1;
//   this.showChecked.parentNode.classList.remove("active");
//   this.showUnchecked.disabled = 1;
//   this.showUnchecked.parentNode.classList.remove("active");
// }