// 保存数据
// 不渲染页面
class Save extends Table {
  constructor(btn, key, index) {
    super();
    this.btn = this.find(btn);
  }
  init() {
    this.click(this.btn, this.save.bind(this, "/save"), "save", 0, 1, 1);
  }
  // 保存
  // 发送一个请求指令，后端将数据写入本地文件
  // 成功后，alert提示
  async save(fs) {
    const res = await this.get(fs);
    console.log(res);

    this.message(res);
  }
}


// 垃圾场

// async save(fs, target, child, parent) {
//   const dom = parent ? this.find(child, parent) : (child ? this.find(target, child) : this.find(target));
//   const data = {
//     list: []
//   };
//   let obj = {},
//     tar = null;

//   if (parent) {
//     if (dom.nodeType) {
//       tar = this.find(target, dom);
//       if (tar.nodeType) {
//         obj = this.fillObj(this.keys, this.data(tar, "value"));
//       } else {
//         obj = this.fillObj(this.keys, this.data(tar, "value"), this.indexs);
//       }
//       data.list[i] = obj;
//     } else {
//       for (let i = 0; i < dom.length; i++) {
//         tar = this.find(target, dom[i]);
//         if (tar.nodeType) {
//           obj = this.fillObj(this.keys, this.data(tar, "value"));
//         } else {
//           obj = this.fillObj(this.keys, this.data(tar, "value"), this.indexs);
//         }
//         data.list[i] = obj;
//       }
//     }
//   } else {
//     if (dom.nodeType) {
//       obj = this.fillObj(this.keys, this.data(dom, "value"));
//     } else {
//       obj = this.fillObj(this.keys, this.data(dom, "value"), this.indexs);
//     }
//     data.list[i] = obj;
//   }

//   const res = await this.post(fs, JSON.stringify(data));

//   this.message(res);
// }