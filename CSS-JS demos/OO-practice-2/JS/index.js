//-------------------设计思路-------------------
//各功能相互独立，可单独调用，同时各方法间存在联调关系。通过init方法实现节点及事件的绑定，然后运行倒计时功能
//-------------------实现功能-------------------
//所有参数仅支持xxxx-xx-xx-xx-xx-xx:年-月-日-时-分-秒传入，参数缺少逻辑同new Date()相同;
//仅支持时间差100小时以内的调用
//封装方法：1）getTime: 可通过传入一个时间参数，获取new Date()格式的对应时间。必须传参！
//				 2）countValue: 可通过传入一个时间参数，计算当前时间与参数的时间差（时、分、秒），不传参数返回0。返回结果为对象形式{gap:时间戳差值,hours:小时时间差，minutes:分钟时间差，seconds:秒时间差};
//				 3）insertTime: 可通过传入一个时间参数，在页面中显示时间差。同时，如果时价差为0，函数将返回true，用于定时器的打断;
//				 4）countTime: 可通过传入一个时间参数，在页面中执行倒计时。不传参倒计时为0;
//-------------------亮点-------------------
//1.通过audio标签的currentTime属性控制音乐的播放断点;
//2.倒计时的显示具有判断逻辑，只在需要更改的情况下，HTML结构中的innerHTML才会重新赋值;
//3.将想法通过各种渠道结合的方式实现;

class CountDown {
	constructor(ele, ...target) {
		this.dom = typeof ele === "string" ? document.querySelector(ele) : ele;
		this.time = this.dom.querySelector(target[0]); //时间输入框
		this.count = this.dom.querySelectorAll(target[1]); //时间显示标签
		this.timer = null; //定时器
	}
	// 所有方法
	// 运行程序
	init(ele, event, keycode,callback) {
		const dom = typeof ele === "string" ? document.querySelector(ele) : ele;
		dom[event] = (key) => {
			if (event.includes("key")) {
				if (keycode) {
					if (key.code !== keycode.replace(keycode[0], keycode[0].toUpperCase())) return; //不等于keycode值则打断执行

					const val = this.getTime(); //获取时间值，作为参数传入countTime，保证起始时间不会每次执行时都重新获取
					if (!val) return; //如果val值为false，则打断执行
					this.countTime(val,callback);
					return;
				} else { //keycode不存在的话，点击任意键执行代码
					const val = this.getTime();
					if (!val) return;
					this.countTime(val,callback);
					return;
				}
			}

			const val = this.getTime();
			if (!val) return;
			this.countTime(val);
		}
	}
	// 获取时间，可以通过传参获取自定义时间格式
	getTime(t) {
		//将输入值转换成数组
		const arr = t ? (typeof t === "string" ? t.split("-") : t) : (this.time.value.trim() ? this.time.value.trim().split("-") : "输入不能为空");
		if (typeof arr === "string") {
			alert(arr);
			return;
		}
		//清空输入框
		if (this.time.value.trim()) this.time.value = "";
		arr[1] -= 1; //将月份-1
		const result = new Date(...arr); //生成时间
		if (isNaN(+result)) {
			alert("获取时间失败，请输入正确的时间格式");
			return;
		}
		return result; //返回时间
	}
	// 计算时间差，可以通过传参获取目标时间差
	countValue(t) {
		//格式化时间
		t = t ? (typeof t === "string" ? (function() {
			const val = t.trim().split("-");
			val[1] -= 1;
			return new Date(...val)
		})() : t) : this.getTime();
		//判断输入值是否为正确的时间
		if (isNaN(+t)) {
			alert("计算时间差失败，请输入正确的时间格式");
			return;
		}
		let gap = ~~((t - new Date()) / 1000); //计算输入时间与当前时间的差值
		if (gap < 0) gap = 0; //如果gap小于0，就让gap = 0。主要用于输入时间已经过时，不启动定时器
		//存gap值
		const flag = gap;
		//计算时间差对应的天、时、分。利用~~特性，只要不是纯数字，全是0
		const hours = ~~(gap / 3600) >= 10 ? ~~(gap / 3600) + "" : "0" + ~~(gap / 3600);
		gap = gap % 3600;
		const minutes = ~~(gap / 60) >= 10 ? ~~(gap / 60) + "" : "0" + ~~(gap / 60);
		gap = gap % 60;
		const seconds = gap >= 10 ? gap + "" : "0" + gap;
		//如果天数超过100天，就弹框报错
		if (hours.length >= 3) {
			alert("超过显示范围");
			return;
		}

		//返回计算值
		return {
			"gap": flag,
			"hours": hours,
			"minutes": minutes,
			"seconds": seconds
		};
	}
	// 插入时间，可以通过传参将自定义时间插入到页面中，显示时间差
	insertTime(t) {
		t = t ? (typeof t === "string" ? this.getTime(t) : t) : this.getTime();
		//计算时间差
		const result = this.countValue(t);
		if (!result) return "typeError"; //时间输入错误的话，不执行下边代码，并返回typeError，供打断定时器

		const hour = ~~(this.count[0].innerHTML + this.count[1].innerHTML),
					minute = ~~(this.count[3].innerHTML + this.count[4].innerHTML);

		//小时赋值
		if (~~result.hours - hour) {
			if (!~~this.count[0].innerHTML && ~~result.hours[0]) this.count[0].innerHTML = result.hours[0];//初始化赋值
			if (result.hours[1] === "9") this.count[0].innerHTML = result.hours[0]; //只有在个位数为9，即需要十位-1时，才给十位赋值
			this.count[1].innerHTML = result.hours[1];
		}
		//分钟赋值
		if (~~result.minutes - minute) {
			if (!~~this.count[3].innerHTML && ~~result.minutes[0]) this.count[3].innerHTML = result.minutes[0];//初始化赋值
			if (result.minutes[1] === "9") this.count[3].innerHTML = result.minutes[0]; //只有在个位数为9，即需要十位-1时，才给十位赋值
			this.count[4].innerHTML = result.minutes[1];
		}
		//秒赋值
		if (!~~this.count[6].innerHTML && ~~result.seconds[0]) this.count[6].innerHTML = result.seconds[0];//初始化赋值
		if (result.seconds[1] === "9") this.count[6].innerHTML = result.seconds[0]; //只有在个位数为9，即需要十位-1时，才给十位赋值
		this.count[7].innerHTML = result.seconds[1];
		
		//失败思路
		// //个位秒数赋值
		// this.count[7].innerHTML = result.seconds[1];
		// //如果秒数十位为0，并且计算结果不为0时，秒数十位赋值————初始化
		// if(!~~this.count[6] && result.seconds[0]) { this.count[6].innerHTML = result.seconds[0]; }
		// //如果秒数个位为9，则给秒数十位赋值
		// if(result.seconds[1] === "9") { this.count[6].innerHTML = result.seconds[0]; }

		// //如果分钟个位为0，但是计算结果不为0，分钟个位赋值————初始化
		// if (!~~this.count[4] && result.minutes[1]) { this.count[4].innerHTML = result.minutes[1]; }
		// //如果秒数为0，则给分钟个位赋值
		// if(!~~result.seconds) { this.count[4].innerHTML = result.minutes[1]; }
		// //如果分钟十位为0，但是计算结果不为0，就给分钟十位赋值————初始化
		// if (!this.count[3] && result.minutes[0]) { this.count[3].innerHTML = result.minutes[0]; }
		// //如果分钟个位为9，则给分钟十位赋值
		// if(result.minutes[1] === "9") { this.count[3].innerHTML = result.minutes[0]; }

		// //如果小时个位为0，但是计算结果不为0，小时个位赋值————初始化
		// if (!~~this.count[1] && result.hours[1]) { this.count[1].innerHTML = result.hours[1]; }
		
		//如果时间差已经为0，返回true，供打断计时器
		if(!result.gap) return true;
	}
	//倒计时
	countTime(t,callback) {
		//存this
		const _this = this;

		//获取目标时间
		//每次执行前先取消上一次的计时
		if (this.timer) clearInterval(this.timer);
		//将本次时间值插入到文本框中
		const flag = this.insertTime(t);
		if (flag === "typeError") return; //如果countValue不是有效值，不执行定时器
		//倒计时
		this.timer = setInterval(function() {
			const stop = _this.insertTime(t);
			if (stop) {
				clearInterval(_this.timer);
				callback && callback();
			}
		},1000)
	}
}

const run = new CountDown(".mask", "input", "span");
run.init(window, "onkeyup", "enter",function() {
	setStyle(run.dom,"transform","translateY(-100%)");
	music("audio",10.5,36,42.5,45,50.5);
	bg("img",0);
	run.init = null; //直接把run.init清除，播放后其他操作将都不能执行，只能看完
});


//遮罩层消失及音乐播放控制
function setStyle(ele,attr,val) {
	ele = typeof ele === "string" ? document.querySelector(ele) : ele;
	ele.style[attr] = val;
}
function music(ele,breakpoint1,breakpoint2,breakpoint3,breakpoint4,breakpoint5) {
	ele = typeof ele === "string" ? document.querySelector(ele) : ele;
	ele.play();
	//通过延迟执行，执行音乐断点
	setTimeout(() => {
		ele.currentTime = 32
	},breakpoint1 * 1000)
	setTimeout(() => {
		ele.currentTime = 62;
	},breakpoint2 * 1000)
	setTimeout(() => {
		ele.currentTime = 32;
	},breakpoint3 * 1000)
	setTimeout(() => {
		ele.currentTime = 64;
	},breakpoint4 * 1000)
	setTimeout(() => {
		ele.currentTime = 169;
	},breakpoint5 * 1000)
}
//背景切换
function bg(ele,index) {
	ele = typeof ele === "string" ? document.querySelector(ele) : ele;
	let timer = null;

	timer = setInterval(() => {
		ele.src = `images/雪碧图 ${index++}.png`;
		if (index === 974) clearInterval(timer);
	},60)
}

