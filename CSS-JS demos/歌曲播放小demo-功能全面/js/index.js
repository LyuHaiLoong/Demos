// 渲染
const render = new Render("audio", "#lrc", "#music-list", "#play-control");
render.init = function(data, id, i, x = ["src", , , "title", "span", "active", render.getId(data, id)["title"]]) {
  this.initMusic(data, id, x[0], i); // 给audio添加音频链接。x[0]对应datade的数据属性src
  this.initLrc(data, id, x[1], x[2]); // 给歌词添加标题和文本，x[1]对应，x[2]分别对应方法中的参数，因为有默认值，所以可以不输入
  this.initList(data, x[3], x[4], x[5], x[6]); // x[3]为歌单对应的data数据属性title，x[4]为歌单中插入的标签（默认为li），x[5]为给活动标签添加的class类名
}
render.reset = function() {
  this.initLrc(true);
  this.initMusic(true, "", "", 0);
  this.initList(true);
  // 清除canplaythrough
  if (music.btnPlay && music.audio[0].musicLoad) this.removeEvent(music.audio[0], "canplaythrough", "musicLoad");
  if (music.audio[0].listMusicLoad) this.removeEvent(music.audio[0], "canplaythrough", "listMusicLoad");
  if (music.audio[0].musicError) this.removeEvent(music.audio[0],"error","musicError");
  music.cancelAnimation(music.progressBar.timer);

  this.changeStyle(this.find("#none", music.dom), "display", "block");
  this.changeStyle([this.find("#error", music.dom), this.find("#ready", music.dom), this.find("#load", music.dom), true], "display", "none");
}
// 歌曲添加与删除
const dataControl = new DataControl("#add-message", "#del-message");
dataControl.initStatus = function() {
  this.title = this.find("input", this.addMessage)[0];
  this.src = this.find("input", this.addMessage)[1];
  this.lrc = this.find("textarea", this.addMessage)[0];
  this.addConfirm = this.find("button", this.addMessage)[0];
  this.addCancel = this.find("button", this.addMessage)[1];
  this.delConfirm = this.find("button", this.delMessage)[0];
  this.delCancel = this.find("button", this.delMessage)[1];
}
dataControl.addMusic = function() {
  const t = this.getValue(this.title),
    s = this.getValue(this.src);
  l = this.getValue(this.lrc);

  // 判断data中是否还有数据
  const empty = data.length;
  // 添加数据
  const flag = this.addData(data, t, s, l); // 判断输入内容是否合规
  if (!flag) return; // 不合规直接返回，不执行操作
  // 判断是否有error判断，如果上一次操作将歌单全部删除，那么添加error事件
  if(!music.audio[0].musicError) music.error(music.audio[0], music.musicError.bind(music), "musicError", false, true, true); 
  // 刷新文档歌曲列表
  if (!empty) { // 如果添加时data中没有数据，重新渲染列表
    render.init(data, 0, 0);
    music.initStatus();
  } else this.html(this.find("ul", render.list)[0], `<li>${data[data.length - 1].title}</li>`, true);
  // 关闭弹窗
  this.changeStyle(this.addMessage, "display");
}
dataControl.cancelAdd = function() {
  this.changeStyle(this.addMessage, "display");
}
dataControl.delMusic = function() {
  // 用于判断删除项是否为当前播放项
  const flag = music.currentPlayId === render.getProp(data, "title", list.select.innerText)["id"];
  const play = music.audio[0].paused ? 0 : 1;
  if (list.select) {
    this.delData(data, list.select.innerText, "title");
    list.select = undefined;
  }
  // 重新渲染列表
  if (data.length) {
    render.initMusic(data,music.currentPlayId > 0 ? --music.currentPlayId  : 0,"src",0);
    render.initList(data, "title", "span", "active", render.getId(data, music.currentPlayId)["title"]);
    if (flag) {
      // 只有双击的音乐不是当前正在播放的音乐，才重新绘制列表
      render.init(data, music.currentPlayId - 1 < 0 ? 0 : music.currentPlayId - 1, 0);
      music.initStatus();
      lrc.initHTML();
    }
    // 如果正在播放，重置进度条
    if (play) music.musicReset();
    // 因为重绘，重新添加加载事件
    music.canplaythrough(music.audio[0], music.musicLoad.bind(music), "musicLoad", false, true, true);
    list.dblclick(list.dom, list.listDblclick.bind(list), "listDblclick", false, true, true);   
    // 清除初始化时的canplaythrough
    // if (music.btnPlay && music.audio[0].musicLoad) music.removeEvent(music.audio[0], "canplaythrough", "musicLoad");
  } else render.reset();

  this.changeStyle(this.delMessage, "display");
}
dataControl.cancelDel = function() {
  this.changeStyle(this.delMessage, "display");
}
dataControl.init = function() {
  // 初始化
  this.initStatus();
  // 添加点击事件
  this.click(this.addConfirm, this.addMusic.bind(this), "addMusic", false, true, true);
  this.click(this.addCancel, this.cancelAdd.bind(this), "cancelAdd", false, true, true);
  this.click(this.delConfirm, this.delMusic.bind(this), "delMusic", false, true, true);
  this.click(this.delCancel, this.cancelDel.bind(this), "cancelDel", false, true, true);
}
// 歌词组件私有方法
const lrc = new Lrc("#box", "#lrc", "#bar", "#btn");
lrc.initHTML = function() {
  this.domH = this.dom.clientHeight; // 获取盒子可视高度
  this.textH = this.text.scrollHeight; // 获取内容高度 
  this.barH = this.bar.clientHeight; // 获取滚动条高度内部
  // 初始化按钮高度
  {
    this.scale = this.textH / this.domH; // 滚动条长度与按钮长度的比值
    this.btnH = this.barH / this.scale; // 实际按钮大小
    this.btnH = this.limit(this.btnH, 10, this.barH);
    this.btnScaleH = this.btnH - (1 / this.scale) * this.barH; // 计算按钮实际大小与初始计算值的高度差
    this.scrollH = this.textH / this.scale / 2 / this.scale // 滚动条移动距离随内容动态改变
  }
  this.changeStyle(this.btn, "height", this.btnH);
}
lrc.mu = function(ev) {
  // 恢复滚动条背景
  this.changeStyle(this.bar, "background", "");
  // 移除事件
  if (this.dom.mousemove) this.removeEvent(this.dom, "mousemove", "mousemove");
  if (this.dom.mouseup) this.removeEvent(this.dom, "mouseup", "mouseup");
}
lrc.mm = function(ev) { // mouseomve
  this.mwClientY = ev.clientY; // 获取鼠标移动时，鼠标在当前视窗下的y坐标
  this.btnTop = this.limit(this.mwClientY - this.mdOffsetY - this.barClientY, 0, this.barH - this.btnH); // 计算y坐标
  this.changeStyle(this.btn, "top", this.btnTop); // 按钮位置
  this.changeStyle(this.text, "transform", `translateY(-${((this.btnTop ? this.btnTop + this.btnScaleH : 0) / this.barH) * 100}%)`) // 内容位置
}
lrc.md = function(ev) { // mousedown
  // 移除CSS动画
  if (this.text.style.transition) this.changeStyle(this.text, "transition", "");
  if (this.btn.style.transition) this.changeStyle(this.btn, "transition", "");
  // 改变滚动条背景颜色
  this.changeStyle(this.bar, "background", "#000");
  // 获取鼠标在btn上的位置以及bar在当前视窗的位置，用于计算btn的top值
  this.mdOffsetY = ev.offsetY; // 获取鼠标在按钮上的y坐标
  this.barClientY = this.bar.getBoundingClientRect().top + this.bar.clientTop; // 获取滚动条在当前视窗下的y坐标
  // 添加mousemove及mouseup事件
  this.mousemove(this.dom, this.mm.bind(this), "mousemove", false, true, true); // 添加鼠标移动事件
  this.mouseup(this.dom, this.mu.bind(this), "mouseup", false, true, true); // 添加鼠标按键松开事件
}
lrc.mw = function(ev) {
  // 添加CSS动画
  if (!this.text.style.transition) this.changeStyle(this.text, "transition", ".5s");
  if (!this.btn.style.transition) this.changeStyle(this.btn, "transition", "top .5s");
  // 如果点击事件前先执行滚轮事件，初始化this.btnTop
  if (!this.btnTop) this.btnTop = 0;
  // 兼容火狐
  let flag = true;
  if (ev.wheelDelta) {
    if (ev.wheelDelta > 0) flag = false;
  } else {
    if (ev.detail < 0) flag = false;
  }
  // 事件行为
  if (flag) {
    this.btnTop = this.limit(this.btnTop + this.scrollH, "", this.barH - this.btnH); // 计算y坐标
    this.changeStyle(this.btn, "top", this.btnTop); // 按钮位置
    this.changeStyle(this.text, "transform", `translateY(-${((this.btnTop + this.btnScaleH) / this.barH) * 100}%)`); // 内容位置
  } else {
    this.btnTop = this.limit(this.btnTop - this.scrollH, 0); // 计算y坐标
    this.changeStyle(this.btn, "top", this.btnTop); // 按钮位置
    this.changeStyle(this.text, "transform", `translateY(-${((this.btnTop ? this.btnTop + this.btnScaleH : 0) / this.barH) * 100}%)`); // 内容位置
  }
}
lrc.ml = function(ev) { // mouseleave
  this.removeEvent(this.dom, "mousewheel", "mousewheel");
  this.removeEvent(this.btn, "mousedown", "mousedown");
  if (this.dom.mousemove) this.removeEvent(this.dom, "mousemove", "mousemove"); // 用于解决鼠标点击事件时，鼠标离开界面再返回，mousemove仍旧执行的bug
  if (this.bar.style.background) this.changeStyle(this.bar, "background", ""); // 移除滚动条背景
  this.changeStyle(this.bar, "opacity", "");
  this.removeEvent(this.dom, "mouseleave", "mouseleave");
}
lrc.me = function(ev) { // mouseenter
  this.mousedown(this.btn, this.md.bind(this), "mousedown", false, true, true);
  this.mousewheel(this.dom, this.mw.bind(this), "mousewheel", 0, false, true, true);
  this.mouseleave(this.dom, this.ml.bind(this), "mouseleave", false, true, true);
  this.changeStyle(this.bar, "opacity", "1");
}
lrc.init = function() {
  this.initHTML();
  this.mouseenter(this.dom, this.me.bind(this), "mouseenter", false, true, true);
}
// 播放组件私有方法
const music = new Music("#play-control", "audio");
music.initStatus = function() {
  this.changeStyle(this.find("#load",this.dom),"display");
  this.changeStyle([this.find("#ready", this.dom), this.find("#error", this.dom), this.find("#none", this.dom), true], "display", "none");
  // 添加当前播放音乐id
  this.currentPlayId = +this.audio[0].dataset.id;
}
music.musicPlay = function() {
  if (!this.audio[0].paused) return; // 如果暂停，才能再次执行
  if (this.audio[0].currentTime === this.audio[0].duration) return; // 播放完毕后，不再执行
  else this.audio[0].play();
  // 赋值当前播放音乐id
  this.currentPlayId = +this.audio[0].dataset.id;
  // 添加播放动画
  this.changeStyle(this.find(".active", "#music-list")[0], "animation-name", "play");
  // 进度条定时器
  this.progress(this.progressBar, this.audio[0], ["width", "opacity"], [this.dom.offsetWidth, 1], "", true, this.changeStyle.bind(this, this.find(".active", "#music-list")[0], "animation-name")); // 为演示方法功能，支持同时改变多个属性值，使用了width和opacity，实际只需要width
  this.countDownOn(this.audio[0], this.find("span", this.countTime), this.audio[0].duration);
}
music.musicPause = function() {
  if (this.audio[0].paused) return;
  this.cancelAnimation(this.progressBar.timer);
  // 移除播放动画
  this.changeStyle(this.find(".active", "#music-list")[0], "animation-name");

  if (this.progressBar.timer instanceof Object) {
    for (let i in this.progressBar.timer) {
      if (this.progressBar.timer.hasOwnProperty(i)) this.progressBar.pauseTimestamp[i] = this.progressBar.currentTimestamp[i];
    }
  } else this.progressBar.pauseTimestamp = this.progressBar.currentTimestamp;
  this.audio[0].pause();
  this.countDownOff();
}
music.musicMuted = function() {
  if (this.audio[0].muted) {
    this.audio[0].muted = false;
    this.changeStyle(this.btnMuted, ["background", "color"], ["", ""]);
    this.changeStyle(this.volume, "display", "");
    if (this.audio[0].volume === 0) {
      this.audio[0].volume = 1;
      this.changeStyle(this.volume, "height", "100%");
    }
  } else {
    this.audio[0].muted = true;
    this.changeStyle(this.btnMuted, ["background", "color"], ["#000", "#fff"]);
    this.changeStyle(this.volume, "display", "none");
  }
}
music.musicReplay = function() {
  this.audio[0].currentTime = 0; // 触发canplaythrough监听事件
  // 初始化进度条参数
  this.cancelAnimation(this.progressBar.timer);
  this.resetProgress(this.progressBar,"previousProgressVal", "previousProgressTime","pauseTimestamp", "startTimestamp","duration");
  // 播放音乐
  if (!this.audio[0].paused ) this.audio[0].pause(); // 先暂停
  this.musicPlay();
}
music.musicReset = function() {
  this.audio[0].currentTime = 0; // 触发canplaythrough监听事件
  // 初始化进度条参数
  this.cancelAnimation(this.progressBar.timer);
  this.resetProgress(this.progressBar,"previousProgressVal", "previousProgressTime","pauseTimestamp", "startTimestamp","duration");
  // 进度条重置
  this.changeStyle(this.progressBar,["width","opacity"],[0,0])
  // 播放音乐
  if (!this.audio[0].paused) this.audio[0].pause(); // 暂停播放状态
}
music.musicVolumePlus = function() {
  if (this.audio[0].volume === 1) return;
  if (this.audio[0].volume > 0.9) this.audio[0].volume = 0.9;
  this.audio[0].volume += .1;
  this.changeStyle(this.volume, "height", `${this.audio[0].volume * 100}%`);
  // 点击按钮，取消静音
  if (this.audio[0].muted) this.musicMuted();
}
music.musicVolumeSub = function() {
  if (this.audio[0].volume === 0) return;
  if (this.audio[0].volume < 0.2) this.audio[0].volume = 0.1; // 添加判断。由于浮点运算，这样计算永远不可能为0，只能约等于0
  this.audio[0].volume -= .1;
  this.changeStyle(this.volume, "height", `${this.audio[0].volume * 100}%`);
  // 判断静音状态
  // 点击按钮，取消静音状态
  if (this.audio[0].muted && this.audio[0].volume !== 0) this.musicMuted();
  // 音量为0，确认静音状态
  if (this.audio[0].volume === 0 && !this.audio[0].muted) this.musicMuted();
}
music.musicClickPlay = function(ev) {
  // 改变进度条CSS及音频播放进度
  this.audio[0].currentTime = (ev.offsetX / this.dom.offsetWidth) * this.audio[0].duration;
  if (this.progressBar.timer instanceof Object) {
    for (let i in this.progressBar.timer) {
      if (this.progressBar.timer.hasOwnProperty(i)) this.progressBar.clickTimestamp[i] = this.progressBar.startTimestamp[i] + this.audio[0].currentTime * 1000; // 时间戳与属性换算，1000
    }
  } else this.progressBar.clickTimestamp = this.progressBar.startTimestamp + this.audio[0].currentTime * 1000;
  // 如果音乐暂停就播放音乐；同时这样也关联了当音乐结束时，点击位置再次从当前位置播放
  if (this.audio[0].paused) this.musicPlay();
}
music.musicLoad = function() {
  this.changeStyle(this.find("#load", this.dom), "display", "none");
  this.changeStyle(this.find("#ready", this.dom), "display");
  // this.html(this.dom, ready); // 会因为current = 0导致的canplaythrough而重绘

  if (!this.btnPlay) { // 因为replay的currentTime = 0会调用canplaythrough事件，所以添加判断，避免重复添加click监听
    // 给按钮绑定事件
    this.btnPlay = this.find("#play", this.dom);
    this.btnPause = this.find("#pause", this.dom);
    this.btnMuted = this.find("#muted", this.dom);
    this.btnReplay = this.find("#replay", this.dom);
    this.btnVolumePlus = this.find("#volume-plus", this.dom);
    this.btnVolumeSub = this.find("#volume-sub", this.dom);
    this.volume = this.find("#volume", this.dom)
    this.totalTime = this.find("#total", this.dom);
    this.countTime = this.find("#count", this.dom);
    this.progressBar = this.find("#progress", this.dom);
    this.click(this.btnPlay, this.musicPlay.bind(this), "musicPlay", false, true, true);
    this.click(this.btnPause, this.musicPause.bind(this), "musicPause", false, true, true);
    this.click(this.btnReplay, this.musicReplay.bind(this), "musicReplay", false, true, true);
    this.click(this.btnMuted, this.musicMuted.bind(this), "musicMuted", false, true, true);
    this.click(this.btnVolumePlus, this.musicVolumePlus.bind(this), "musicVolumePlus", false, true, true);
    this.click(this.btnVolumeSub, this.musicVolumeSub.bind(this), "mouseVolumeSub", false, true, true);
    this.click(this.progressBar.parentNode, this.musicClickPlay.bind(this), "musicClickPlay", false, true, true);
  }
  // 初始化时间
  this.initTime(this.audio[0].duration, this.find("span", this.totalTime));
  // 初始化音量
  this.changeStyle(this.volume, "height", `${this.audio[0].volume * 100}%`)
}
music.musicError = function() {
  this.changeStyle(this.find("#load", this.dom), "display", "none");
  this.changeStyle(this.find("#error", this.dom), "display", "block");
  // this.html(this.dom, error);
}
music.init = function() {
  // 初始化加载状态
  this.initStatus();
  this.canplaythrough(this.audio[0], this.musicLoad.bind(this), "musicLoad", false, true, true);
  this.error(this.audio[0], this.musicError.bind(this), "musicError", false, true, true);
}
// 歌词列表组件私有方法
const list = new List("#list-wrap", "#music-list", "#add", "#del");
list.initStatus = function() { // 重置界面状态
  // 显示加载信息
  this.changeStyle(this.find("#load", music.dom), "display");
  // 如果已经加载成功，隐藏播放组件
  if (this.find("#ready", music.dom).style.display !== "none") this.changeStyle(this.find("#ready", music.dom), "display", "none");
  // 如果加载失败，隐藏失败信息
  else this.changeStyle(this.find("#error", music.dom), "display", "none");
}
list.listClick = function(ev) {
  // 判断，只有点击li才会触发事件
  if (ev.target === this.dom || ev.target === this.add || ev.target === this.del || this.select === ev.target) return;

  // 改变CSS
  if (this.select) {
    this.changeStyle(ev.target, ["background", "color"], ["#000", "#fff"]);
    this.changeStyle(this.select, ["background", "color"]);
  } else this.changeStyle(ev.target, ["background", "color"], ["#000", "#fff"]);
  this.select = ev.target; // 这么写，可以直接把再次点击取消选中状态加上。但是重复点击同一个li，出bug
}
list.listDblclick = function(ev) {
  if (ev.target === this.dom || ev.target === this.add || ev.target === this.del) return;
  const id = render.getProp(data, "title", ev.target.innerText).id; // 如果点击的是已经在播放的音乐，由于li内有span，所以不能用innerHTML，必须用innerText
  // 只有双击的音乐不是当前正在播放的音乐，才重新绘制列表
  if (id !== music.currentPlayId) {
    render.init(data, id, 0);
    this.initStatus();
    lrc.initHTML();
  }
  else { // 如果点击的事正在播放的音乐，判断是否暂停，暂停就播放
    if (music.audio[0].paused) music.musicPlay();
  }
  // 清除初始化时的canplaythrough，添加双击的canplaythrough
  if (music.btnPlay && music.audio[0].musicLoad) music.removeEvent(music.audio[0], "canplaythrough", "musicLoad");
  if (!music.audio[0].listMusicLoad) this.canplaythrough(music.audio[0], this.listMusicLoad.bind(this), "listMusicLoad", false, true, true);
}
list.listMusicLoad = function() {
  this.changeStyle(this.find("#ready", music.dom), "display");
  this.changeStyle(this.find("#load", music.dom), "display", "none");
  music.initTime(music.audio[0].duration, this.find("span", music.totalTime));

  music.musicReplay();
  // 移除canplalthrough事件，避免replay重复触发
  this.removeEvent(music.audio[0], "canplaythrough", "listMusicLoad");
}
list.listAdd = function() {
  this.changeStyle(dataControl.addMessage, "display", "block");
}
list.listDel = function() {
  // 没有选中项，提示错误
  if (!list.select) return alert("未选中歌曲");
  this.changeStyle(dataControl.delMessage, "display", "block");
}
list.init = function() {
  // list点击事件与双击事件
  this.click(this.dom, this.listClick.bind(this), "listClick", false, true, true);
  this.dblclick(this.dom, this.listDblclick.bind(this), "listDblclick", false, true, true);
  // 添加歌曲
  this.click(this.add, this.listAdd.bind(this), "listAdd", false, true, true);
  this.click(this.del, this.listDel.bind(this), "listDel", false, true, true);
}

// 执行程序
render.init(data, 0, 0); // data数据源，0对应数据中的歌曲id，0对应audio的索引
dataControl.init();
lrc.init();
music.init();
list.init();