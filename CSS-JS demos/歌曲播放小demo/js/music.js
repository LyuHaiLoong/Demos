 // 音乐播放控制
 class Music extends Father {
   constructor(ele, audio) {
     super();
     this.dom = this.find(ele);
     this.audio = this.find(audio);
   }
   error(ele, callback, funcName, boolean, stop, prevent, call) {
     if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
     else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
     else ele = this.find(ele);

     if (ele.nodeType) {
       ele[funcName] = function(ev) {
         if (stop) ev.stopPropagation();
         if (prevent) ev.preventDefault();
         call ? callback.call(this, ev) : callback(ev);
       }
       ele.addEventListener("error", ele[funcName], boolean);
     } else {
       for (let val of ele) {
         this.load(val, callback, funcName, boolean, stop, prevent, call);
       }
     }
   }
   /* 改为requestAnimationFrame，更平滑，更合理，更好控制
   progress(ele,attr,num,time,flag,boolean) {
     const _this = this;
     const progress = () => {
       this.timer = setTimeout(()=> {
         this.changeStyle(ele,attr,num,boolean);
         if(flag()) return clearTimeout(this.timer);
         else progress();
       },time)
     }
     progress();
   }
   */
   progress(ele, music, attr, val, boolean, arr, callback) { // 不支持CSS动画，boolean用于判断所有attr是作用在一个节点上，还是分别作用在不同节点上。默认false，与节点一一对应;arr用于在给同一进度条绑定了多个属性变化时，判断要返回定时器的数组，用于清除定时器
     // 判断ele参数类型
     if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
     else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
     else ele = this.find(ele);
     // 一个进度条，只对应一个音频或视频
     if (ele.nodeType) {
       // 可以有多个属性变换
       if (attr instanceof Array) {
         if (val instanceof Array) {
           for (let i = 0; i < attr.length; i++) {
             this.progress(ele, music, attr[i], val[i], boolean, arr, callback);
           }
         } else {
           for (let i = 0; i < attr.length; i++) {
             this.progress(ele, music, attr[i], val, boolean, arr, callback);
           }
         }
       } else { // 只有一个进度条，一个音频或视频，一个属性，一个属性值时，执行操作
         // ele.duration为节点公共属性，不需要区分arr
         if (ele.duration === undefined) ele.duration = music.duration;
         if (arr) {
           // 初始化
           if (!ele.timer) ele.timer = {};
           if (!ele.clickTimestamp) ele.clickTimestamp = {};
           if (!ele.pauseTimestamp) ele.pauseTimestamp = {};
           if (!ele.previousProgressVal) ele.previousProgressVal = {};
           if (!ele.previousProgressTime) ele.previousProgressTime = {};
           if (!ele.startTimestamp) ele.startTimestamp = {};
           if (!ele.currentTimestamp) ele.currentTimestamp = {};
           if (ele.previousProgressVal[attr] === undefined) ele.previousProgressVal[attr] = 0;
           if (ele.previousProgressTime[attr] === undefined) ele.previousProgressTime[attr] = 0;
           // 进度函数
           const progress = (timestamp) => {
             // 初始化音乐总时间
             if (ele.duration === undefined) ele.duration = music.duration;
             // 记录开始播放的时间戳
             if (ele.startTimestamp[attr] === undefined) ele.startTimestamp[attr] = timestamp;
             // 刷新当前播放进度时间戳
             ele.currentTimestamp[attr] = timestamp;
             // 计算当前属性值
             let add = null;
             // 如果点击了进度条
             if (ele.clickTimestamp[attr] !== undefined) {
               add = ((ele.clickTimestamp[attr] - ele.startTimestamp[attr]) / 1000) * (val / ele.duration);
               ele.previousProgressTime[attr] = music.currentTime;
               ele.previousProgressVal[attr] = add;
               ele.startTimestamp[attr] = timestamp - ele.clickTimestamp[attr] + ele.startTimestamp[attr];
               ele.clickTimestamp[attr] = undefined;
             }
             // 如果暂停了，就重新初始化时间戳、当前进度值
             if (ele.pauseTimestamp[attr] !== undefined) { // 暂停时间需要分别赋值，不然一个节点重复循环时，不进判断
               // 进度赋值
               add = ((ele.pauseTimestamp[attr] - ele.startTimestamp[attr]) / 1000) * ((val - ele.previousProgressVal[attr]) / (ele.duration - ele.previousProgressTime[attr]));
               // 初始化
               ele.previousProgressTime[attr] = music.currentTime; // 当前进度时间等于音乐播放进度时间
               ele.previousProgressVal[attr] = add; // 当前进度值就等于本次时间戳的计算值，一定先计算再重新赋值，计算顺序不能错
               ele.startTimestamp[attr] = timestamp - ele.pauseTimestamp[attr] + ele.startTimestamp[attr]; // 重置时间计算起点 = 调用时间戳 - 上次暂停的时间戳 + 上次的时间戳起点 = 与当前属性值关联的时间戳
               ele.pauseTimestamp[attr] = undefined; // 暂停时间戳归零
             } else add = ((timestamp - ele.startTimestamp[attr]) / 1000) * ((val - ele.previousProgressVal[attr]) / (ele.duration - ele.previousProgressTime[attr]));
             if (add > val) add = val;
             this.changeStyle(ele, attr, add);
             if (add < val) {
               ele.timer[attr] = requestAnimationFrame(progress);
             } else {
               typeof callback === "function" ? callback() : callback;
             }
           }
           ele.timer[attr] = requestAnimationFrame(progress);
         } else {
           // 初始化
           if (ele.duration === undefined) ele.duration = music.duration;
           if (ele.previousProgressVal === undefined) ele.previousProgressVal = 0;
           if (ele.previousProgressTime === undefined) ele.previousProgressTime = 0;
           // 进度函数
           const progress = (timestamp) => {
             // 记录开始播放的时间戳
             if (ele.startTimestamp === undefined) ele.startTimestamp = timestamp;
             // 刷新当前播放进度时间戳
             ele.currentTimestamp = timestamp;
             // 计算当前属性值
             let add = null;
             // 如果点击了进度条
             if (ele.clickTimestamp !== undefined) {
               add = ((ele.clickTimestamp - ele.startTimestamp) / 1000) * (val / ele.duration);
               ele.previousProgressTime = music.currentTime;
               ele.previousProgressVal = add;
               ele.startTimestamp = timestamp - ele.clickTimestamp + ele.startTimestamp;
               ele.clickTimestamp = undefined;
             }
             // 如果暂停了，就重新初始化时间戳、当前进度值
             if (ele.pauseTimestamp !== undefined) {
               // 进度赋值
               add = ((ele.pauseTimestamp - ele.startTimestamp) / 1000) * ((val - ele.previousProgressVal) / (ele.duration - ele.previousProgressTime));
               // 初始化
               ele.previousProgressTime = music.currentTime; // 当前进度时间等于音乐播放进度时间
               ele.previousProgressVal = add; // 当前进度值就等于本次时间戳的计算值，一定先计算再重新赋值，计算顺序不能错
               ele.startTimestamp = timestamp - ele.pauseTimestamp + ele.startTimestamp; // 重置时间计算起点 = 调用时间戳 - 上次暂停的时间戳 + 上次的时间戳起点 = 与当前属性值关联的时间戳
               ele.pauseTimestamp = undefined; // 暂停时间戳归零
             } else add = ((timestamp - ele.startTimestamp) / 1000) * ((val - ele.previousProgressVal) / (ele.duration - ele.previousProgressTime));
             if (add > val) add = val;
             this.changeStyle(ele, attr, add);
             if (add < val) {
               ele.timer = requestAnimationFrame(progress);
             } else {
               typeof callback === "function" ? callback() : callback;
             }
           }
           ele.timer = requestAnimationFrame(progress);
         }
       }
     } else {
       // 判断music音频参数类型，music可以是audio或vedio标签，也可以是节点，要先通过find查找判断。进度条与music的长度一定是一一对应的
       if (music instanceof Array && music[music.length - 1] !== true) music = this.find(...music);
       else if (music instanceof Array && music[music.length - 1] === true) music = this.find(music.slice(0, music.length - 1));
       else music = this.find(music);
       if (ele.length !== music.length) throw new Error("Invaild parameter 2.The length of parameter 2 must be equal to parameter 1");

       // 递归，进度条与音频或视频一定是一一对应的
       if (attr instanceof Array) {
         if (boolean) { // 如果boolean为true，说明attr及val要全部赋值给节点，就不再判断attr及val，直接递归
           for (let i = 0; i < ele.length; i++) {
             this.progress(ele[i], music[i], attr, val, boolean, arr, callback);
           }
         } else { // 如果boolean为false，那么属性及属性值一一对应
           if (attr instanceof Array) {
             if (val instanceof Array) {
               for (let i = 0; i < ele.length; i++) {
                 this.progress(ele[i], music[i], attr[i], val[i], boolean, arr, callback)
               }
             } else {
               for (let i = 0; i < ele.length; i++) {
                 this.progress(ele[i], music[i], attr[i], val, boolean, arr, callback);
               }
             }
           } else {
             for (let i = 0; i < ele.length; i++) {
               this.progress(ele[i], music[i], attr, val, callback);
             }
           }
         }
       }
     }
   }
   cancelAnimation(timer) { // 赶脚着没有直接写省事
     if (timer instanceof Object) {
       for (let i in timer) {
         if (timer.hasOwnProperty(i)) cancelAnimationFrame(timer[i])
       }
     } else cancelAnimationFrame(timer);
   }
   resetProgress(ele,...prop) { // prop始终以数组形式出现
      // 判断ele参数类型
      if (ele instanceof Array && ele[ele.length - 1] !== true) ele = this.find(...ele);
      else if (ele instanceof Array && ele[ele.length - 1] === true) ele = this.find(ele.slice(0, ele.length - 1));
      else ele = this.find(ele);

      if (ele.nodeType) {
        for (let val of prop) {
          if (typeof val !== "string") throw new Error("Parameter 2 type error,must be String");
          if (ele[val] instanceof Object) {
            for (let j in ele[val]) {
              if (ele[val].hasOwnProperty(j)) ele[val][j] = undefined;
            }
          }
          else ele[val] = undefined;
        }
      }
      else {
        for (let val of ele) {
          this.resetProgress(val,prop)
        }
      }
   }
   initTime(time, ele) {
     const minutes = ~~(time / 60) < 10 ? "0" + ~~(time / 60) : "" + ~~(time / 60);
     time = time % 60;
     const seconds = ~~time < 10 ? "0" + ~~time : "" + ~~time;
     this.html(ele, [minutes[0], minutes[1], seconds[0], seconds[1]]);
   }
   countDownOn(music, ele, flag) {
     let time = music.currentTime;
     let _time = time; // 定时器判断
     const minutes = ~~(time / 60) < 10 ? "0" + ~~(time / 60) : "" + ~~(time / 60);
     time = time % 60;
     const seconds = ~~time < 10 ? "0" + ~~time : "" + ~~time;
     if (ele.nodeType) this.html(ele, `${minutes}:${seconds}`);
     else {
       if (ele.length !== 4) throw new Error("Invalid parameter 2");
       if (ele[0].innerHTML !== minutes[0]) this.html(ele[0], minutes[0]);
       if (ele[1].innerHTML !== minutes[1]) this.html(ele[1], minutes[1]);
       if (ele[2].innerHTML !== seconds[0]) this.html(ele[2], seconds[0]);
       if (ele[3].innerHTML !== seconds[1]) this.html(ele[3], seconds[1]);
     }
     if (_time < flag) this.countDown = requestAnimationFrame(this.countDownOn.bind(this, music, ele, flag), 1000);
   }
   countDownOff() {
     cancelAnimationFrame(this.countDown);
   }
 }