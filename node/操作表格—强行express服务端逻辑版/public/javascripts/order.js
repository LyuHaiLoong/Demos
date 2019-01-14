// 上移、下移、删除功能
// 根据tbody显示状态，渲染tbody
class Order extends Table {
  constructor(up, down, del) {
    super();
    this.btnUp = this.find(up); // 上移
    this.btnDown = this.find(down); // 下移
    this.btnDel = this.find(del); // 删除
  }
  init() {
    this.click(this.tbody, this.up.call(this, "order/0", "td", "tr", this.tbody, "value"), "moveUp", 0, 1);
    this.click(this.tbody, this.down.call(this, "order/1", "td", "tr", this.tbody, "value"), "moveDown", 0, 1);
    this.click(this.tbody, this.del.call(this, "order/2", "td", "tr", this.tbody, "value"), "delete", 0, 1);
  }
  // 点击上移
  up(fs, child, parent, wrap, value) {
    return async ev => {
      // 如果点击的不是上移按钮，不执行操作
      if (!Array.prototype.includes.call(this.btnUp, ev.target)) return;
      // 获取点击按钮的目标祖先节点，即tr，用于获取数据
      const parentNode = this.parentNode(ev.target, parent);
      // 获取tr的相邻的上一个tr节点，用于数据对比调换位置
      const previousNode = parentNode.previousElementSibling;
      // 如果没有上一节点，说明已经为第一个，alert提示
      if (previousNode === null) return this.message("first");

      // 无法判断选中状态，进垃圾场
      // const id = [];
      // id[1] = parentNode.dataset.id;
      // id[0] = previousNode.dataset.id;

      // 获取祖先tr的数据
      const parentData = this.getData(this.find(child, parentNode), value);
      // 获取祖先tr上一tr节点数据
      const previousData = this.getData(this.find(child, previousNode), value);
      // 两组数据合并
      parentData.list.push(...previousData.list);
      // 获取当前页面下的所有数据
      const allData = this.getData(this.find(child, wrap), value);
      // 发送数据，渲染结果
      const postData = [parentData, allData];
      const res = await this.post(fs, JSON.stringify(postData));

      this.render(res);
    }
  }
  // 点击下移，逻辑同上移
  down(fs, child, parent, wrap, value) {
    return async ev => {
      if (!Array.prototype.includes.call(this.btnDown, ev.target)) return;

      const parentNode = this.parentNode(ev.target, parent);
      const nextNode = parentNode.nextElementSibling;
      if (nextNode === null) return this.message("last");

      // 无法判断选中状态，进垃圾场
      // const id = [];
      // id[0] = parentNode.dataset.id;
      // id[1] = nextNode.dataset.id;

      const parentData = this.getData(this.find(child, parentNode), value);
      const nextData = this.getData(this.find(child, nextNode), value);
      parentData.list.push(...nextData.list);
      const allData = this.getData(this.find(child, wrap), value);

      const postData = [parentData, allData];
      const res = await this.post(fs, JSON.stringify(postData));

      this.render(res);
    }
  }
  // 点击删除
  del(fs, child, parent, wrap, value) {
    return async ev => {
      if (!Array.prototype.includes.call(this.btnDel, ev.target)) return;

      const parentNode = this.parentNode(ev.target, parent);
      // 获取当前节点祖先tr数据，及页面全部数据，因为del不用重排序，所以不需要相邻节点数据
      const parentData = this.getData(this.find(child, parentNode), value);
      const allData = this.getData(this.find(child, wrap), value);

      const postData = [parentData, allData];
      const res = await this.post(fs, JSON.stringify(postData));

      this.render(res);
    }
  }
}