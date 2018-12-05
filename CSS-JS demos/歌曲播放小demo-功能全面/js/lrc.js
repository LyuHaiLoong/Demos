 // 歌词滚动
 class Lrc extends Father {
   constructor(ele, text, bar, btn) {
     super();
     this.dom = this.find(ele);
     this.text = this.find(text);
     this.bar = this.find(bar);
     this.btn = this.find(btn);
   }
   // 事件
   mouseenter(ele, callback, funcName, boolean, stop, prevent, call) {
     if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
     else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
     else ele = this.find(ele);

     if (ele.nodeType) {
       ele[funcName] = function(ev) {
         ev = ev || window.event;
         if (stop) ev.stopPropagation();
         if (prevent) ev.preventDefault();
         call ? callback.call(this, ev) : callback(ev);
       }
       ele.addEventListener("mouseenter", ele[funcName], boolean);
     } else {
       for (let val of ele) {
         this.mouseenter(val, callback, funcName, boolean, stop, prevent, call);
       }
     }
     // 弃用将函数挂在对象上的思路，改为将方法绑定到节点，可以直接操作节点，保持了节点的独立性
     // if (!this[funcName]) { // 判断传入的函数是否已经在对象下，如果已经存在就不再重新赋值。避免递归重复赋值，以及无法清除事件
     //   this[funcName] = function(ev) {
     //     ev = ev || window.event;
     //     call ? callback.call(this,ev) : callback(ev);
     //     if (stop) ev.stopPropagation();
     //     if (prevent) ev.preventDefault();
     //   }
     // }
     // if (ele.nodeType) ele.addEventListener("mouseenter",this[funcName],boolean);
     // else {
     //   for (let val of ele){
     //     // val要么是节点要么是节点集合，所以通过nodeType判断
     //     if (!val.nodeType) this.mouseenter(val,callback,funcName,boolean,stop,prevent,call); // 如果val是节点集合，递归
     //     // 两步可以合并成一步，全部用递归实现，但是else这一步感觉用递归有点多余了，所以就直接写了
     //     else val.addEventListener("mouseenter",this[funcName],boolean);
     //   }
     // }
   }
   mouseleave(ele, callback, funcName, boolean, stop, prevent, call) {
     if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
     else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
     else ele = this.find(ele);
     if (ele.nodeType) {
       ele[funcName] = function(ev) {
         ev = ev || window.event;
         if (stop) ev.stopPropagation();
         if (prevent) ev.preventDefault();
         call ? callback.call(this, ev) : callback(ev);
       }
       ele.addEventListener("mouseleave", ele[funcName], boolean);
     } else {
       for (let val of ele) {
         this.mouseleave(val, callback, funcName, boolean, stop, prevent, call);
       }
     }
   }
   mousedown(ele, callback, funcName, boolean, stop, prevent, call) {
     if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
     else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
     else ele = this.find(ele);
     if (ele.nodeType) {
       ele[funcName] = function(ev) {
         ev = ev || window.event;
         if (stop) ev.stopPropagation();
         if (prevent) ev.preventDefault();
         call ? callback.call(this, ev) : callback(ev);
       }
       ele.addEventListener("mousedown", ele[funcName], boolean);
     } else {
       for (let val of ele) {
         this.mousedown(val, callback, funcName, boolean, stop, prevent, call);
       }
     }
   }
   mouseup(ele, callback, funcName, boolean, stop, prevent, call) {
     if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
     else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
     else ele = this.find(ele);
     if (ele.nodeType) {
       ele[funcName] = function(ev) {
         ev = ev || window.event;
         if (stop) ev.stopPropagation();
         if (prevent) ev.preventDefault();
         call ? callback.call(this.ev) : callback(ev);
       }
       ele.addEventListener("mouseup", ele[funcName], boolean);
     } else {
       for (let val of ele) {
         this.mouseup(val, callback, funcName, boolean, stop, prevent, call);
       }
     }
   }
   mousemove(ele, callback, funcName, boolean, stop, prevent, call) {
     if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
     else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
     else ele = this.find(ele);
     if (ele.nodeType) {
       ele[funcName] = function(ev) {
         ev = ev || window.event;
         if (stop) ev.stopPropagation();
         if (prevent) ev.preventDefault();
         call ? callback.call(this, ev) : callback(ev);
       }
       ele.addEventListener("mousemove", ele[funcName], boolean);
     } else {
       for (let val of ele) {
         this.mousemove(val, callback, funcName, boolean, stop, prevent, call);
       }
     }
   }
   mousewheel(ele, callback, funcName, wait, boolean, stop, prevent, call) {
     if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
     else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
     else ele = this.find(ele);
     // 判断错误，window默认行为没有阻止成功。想要直接改变window的mousewheel事件
     // if (stopWindow) { // 判断是否要阻止window的滚动行为
     //   if (!window.stopmousewheel) {
     //      // defineProperty添加的属性，configurable为false不可删除、writable为false不可写、enumerable为false不可枚举
     //     Object.defineProperty(window,"stopmusewheel",{ // 给window挂一个阻止默认行为的函数，可读可枚举可删除、不可写
     //       configurable: true, // 可删除，默认为false
     //       enumerable: true,
     //       value: function(ev) {
     //         ev.preventDefault();
     //       },
     //     })
     //   }
     //   if (/Firefox/.test(navigator.userAgent)) window.addEventListener("DOMmouseScroll",window.stopomusewheel,false)
     // }
     if (ele.nodeType) {
       const fn = function(ev) {
         // 冒泡和阻止默认行为，关联到防抖函数中，此处不是ev第一次调用的函数，无法阻止冒泡和默认行为
         // ev = ev || window.event;
         // if (stop) ev.stopPropagation();
         // if (prevent) ev.preventDefault();
         call ? callback.call(this, ev) : callback(ev);
       }
       if (/Firefox/.test(navigator.userAgent)) ele.addEventListener("DOMMouseScroll", ele[funcName] = this.throttle(fn, stop, prevent, ~~wait), boolean); // 火狐浏览器检测
       else ele.addEventListener("mousewheel", ele[funcName] = this.throttle(fn, stop, prevent, wait), boolean);
     } else {
       for (let val of ele) {
         this.mousewheel(val, callback, funcName, wait, boolean, stop, prevent, call);
       }
     }
   }
   // 函数节流
   throttle(func, stop, prevent, wait = 0) { // 延迟时间默认为0
     let timer = null;

     const later = function() {
       timer = null;
     }

     return function(ev) {
       // 必须在事件参数第一次传入的时候阻止冒泡和默认行为
       ev = ev || window.event;
       if (stop) ev.stopPropagation();
       if (prevent) ev.preventDefault();
       if (!timer) {
         func.call(this, ev);
         timer = setTimeout(later, wait);
       }
     }
   }
   // 设置限定范围值函数
   limit(val, min = -Infinity, max = Infinity) {
     // if (isNaN(val) || isNaN(min) || isNaN(max)) throw new Error("The parameters must be Number");
     // 写着玩，还是if else好点
     val = Math.max(val, min);
     val = Math.min(val, max);
     return val;
   }
 }