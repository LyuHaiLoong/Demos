async function init() {
  // 渲染，异步
  const render = new Init();
  await render.init();

  const add = new Add("#name", "#age", "#id", "#submit", "tr");
  const func = new Func(["button", ".func", 0], "#sAll", "tr");
  add.init();
  func.init();
}
init();

// 实现功能：
//  1、添加员工
//  2、排序
//  3、删除
//  4、选中状态保存
// 坑：
//  1、------------------setAttribute操作checkbox时，设置checked也无法选中checkbox。不知道原因。------------------
//  2、通过bind绑定了this的函数，无法再通过call、apply改变this
//  3、通过return函数，利用闭包，给封装的事件函数，添加既可以访问ev，也可以传入其他参数的函数
//  4、url.parse(res.url)获取url对象
//  5、模板字符串里可以写函数，挺好用
//  6、用node引入html文件时，里边的link和src等外链都会被加载，会向服务器发送标签内的链接地址的请求，所以每个请求都需要服务器对其进行加载，返回值
//  7、读取CSS、JS等文件，需要返回相应的文档格式，text/7、读取CSS、JS等文件，需要返回相应的文档格式，text/javascript、text/css进行解析
// 不足：
//  1、封装的方法，拆分不够，参数过多，独立性不强。代码过于冗长