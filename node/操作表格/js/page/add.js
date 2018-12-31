class Add extends Table {
  constructor(a, b, c, d, e) {
    super();
    this.a = this.find(a);
    this.b = this.find(b);
    this.c = this.find(c);
    this.d = this.find(d);
    this.l = this.find(e, this.t); // 表格长度动态跟踪
  }
  init() {
    // 事件中，不论第一个参数传入啥，
    this.click(this.d, this.add.call(this, this.a, this.b, this.c), "addList", 0, 1, 1);
    this.keyup(document, this.add.call(this, this.a, this.b, this.c),
      "addList", 0, 1, 1);
  }

  add(a, b, c) {
    const add = function (ev) {
      if (ev.type !== "click" && ev.type !== "keyup") return;
      if (ev.type === "keyup" && ev.keyCode !== 13) return;

      const x = a.value.trim(),
        y = b.value.trim(),
        z = c.value.trim();
      if (!x || !y || !z) return this.error(2);
      const e = {
        0: z,
        1: x,
        2: y
      }
      this.table(this.i, e, [0, 1, 2], 1);
      this.resetValue(a, b, c, "");
      a.focus();
    };
    return add.bind(this);
  }
  resetValue(a, b, c, d, e, f) {
    a.value = d;
    b.value = e ? e : d;
    c.value = f ? f : d;
  }
}